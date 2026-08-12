<?php

namespace Tests\Feature\Admin;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminRouteAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login_from_admin_dashboard(): void
    {
        $response = $this->get('/admin');

        $response->assertRedirect(route('login'));
    }

    public function test_guest_is_redirected_to_login_from_any_admin_subpage(): void
    {
        $this->get('/admin/categories')->assertRedirect(route('login'));
        $this->get('/admin/products')->assertRedirect(route('login'));
        $this->get('/admin/orders')->assertRedirect(route('login'));
        $this->get('/admin/staff')->assertRedirect(route('login'));
    }

    public function test_plain_customer_gets_403_on_admin_dashboard(): void
    {
        $customer = User::factory()->create();

        $response = $this->actingAs($customer)->get('/admin');

        $response->assertForbidden();
    }

    public function test_plain_customer_gets_403_on_every_admin_subpage(): void
    {
        $customer = User::factory()->create();

        $this->actingAs($customer)->get('/admin/categories')->assertForbidden();
        $this->actingAs($customer)->get('/admin/products')->assertForbidden();
        $this->actingAs($customer)->get('/admin/orders')->assertForbidden();
        $this->actingAs($customer)->get('/admin/staff')->assertForbidden();
    }

    public function test_super_admin_can_reach_every_admin_page(): void
    {
        $admin = User::factory()->withRole('super_admin')->create();

        $this->actingAs($admin)->get('/admin')->assertOk();
        $this->actingAs($admin)->get('/admin/categories')->assertOk();
        $this->actingAs($admin)->get('/admin/products')->assertOk();
        $this->actingAs($admin)->get('/admin/orders')->assertOk();
        $this->actingAs($admin)->get('/admin/staff')->assertOk();
    }

    public function test_product_manager_can_manage_catalog_but_not_orders_or_staff(): void
    {
        $productManager = User::factory()->withRole('product_manager')->create();

        $this->actingAs($productManager)->get('/admin/categories')->assertOk();
        $this->actingAs($productManager)->get('/admin/products')->assertOk();
        $this->actingAs($productManager)->get('/admin/orders')->assertForbidden();
        $this->actingAs($productManager)->get('/admin/staff')->assertForbidden();
    }

    public function test_order_manager_can_view_and_update_orders_but_not_catalog_or_staff(): void
    {
        $orderManager = User::factory()->withRole('order_manager')->create();
        $order = $this->createOrder($orderManager);

        $this->actingAs($orderManager)->get('/admin/orders')->assertOk();
        $this->actingAs($orderManager)
            ->patch("/admin/orders/{$order->id}", ['status' => 'processing'])
            ->assertSessionHasNoErrors();
        $this->assertSame('processing', $order->fresh()->status);

        $this->actingAs($orderManager)->get('/admin/categories')->assertForbidden();
        $this->actingAs($orderManager)->get('/admin/products')->assertForbidden();
        $this->actingAs($orderManager)->get('/admin/staff')->assertForbidden();
    }

    public function test_support_staff_can_view_orders_but_cannot_update_them_or_touch_catalog(): void
    {
        $supportStaff = User::factory()->withRole('support_staff')->create();
        $order = $this->createOrder($supportStaff);

        $this->actingAs($supportStaff)->get('/admin/orders')->assertOk();
        $this->actingAs($supportStaff)
            ->patch("/admin/orders/{$order->id}", ['status' => 'processing'])
            ->assertForbidden();
        $this->assertSame('pending', $order->fresh()->status);

        $this->actingAs($supportStaff)->get('/admin/categories')->assertForbidden();
        $this->actingAs($supportStaff)->get('/admin/products')->assertForbidden();
        $this->actingAs($supportStaff)->get('/admin/staff')->assertForbidden();
    }

    public function test_only_super_admin_can_change_a_users_role(): void
    {
        $productManager = User::factory()->withRole('product_manager')->create();
        $target = User::factory()->create();

        $this->actingAs($productManager)
            ->patch("/admin/staff/{$target->id}", ['role' => 'support_staff'])
            ->assertForbidden();

        $this->assertSame('customer', $target->fresh()->role->value);

        $superAdmin = User::factory()->withRole('super_admin')->create();

        $this->actingAs($superAdmin)
            ->patch("/admin/staff/{$target->id}", ['role' => 'support_staff'])
            ->assertSessionHasNoErrors();

        $this->assertSame('support_staff', $target->fresh()->role->value);
    }

    public function test_last_super_admin_cannot_be_demoted(): void
    {
        $onlySuperAdmin = User::factory()->withRole('super_admin')->create();

        $response = $this->actingAs($onlySuperAdmin)
            ->patch("/admin/staff/{$onlySuperAdmin->id}", ['role' => 'product_manager']);

        $response->assertSessionHasErrors('role');
        $this->assertSame('super_admin', $onlySuperAdmin->fresh()->role->value);
    }

    private function createOrder(User $user): Order
    {
        return Order::create([
            'user_id' => $user->id,
            'status' => 'pending',
            'subtotal' => 10,
            'total' => 10,
            'shipping_address' => '123 Test Street',
        ]);
    }
}
