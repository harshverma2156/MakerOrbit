<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InertiaSharedPropsTest extends TestCase
{
    use RefreshDatabase;

    public function test_shared_auth_user_prop_exposes_role_but_not_password_or_remember_token(): void
    {
        $user = User::factory()->create(['role' => 'super_admin']);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertInertia(fn ($page) => $page
            ->where('auth.user.id', $user->id)
            ->where('auth.user.email', $user->email)
            ->where('auth.user.role', 'super_admin')
            ->missing('auth.user.password')
            ->missing('auth.user.remember_token'),
        );
    }

    public function test_shared_auth_user_prop_is_null_for_guests(): void
    {
        $response = $this->get('/');

        $response->assertInertia(fn ($page) => $page->where('auth.user', null));
    }

    public function test_shared_cart_item_count_is_zero_for_guests_and_empty_carts(): void
    {
        $this->get('/')->assertInertia(fn ($page) => $page->where('cartItemCount', 0));

        $customer = User::factory()->create();

        $this->actingAs($customer)
            ->get('/')
            ->assertInertia(fn ($page) => $page->where('cartItemCount', 0));
    }

    public function test_shared_cart_item_count_sums_quantities_across_the_customers_cart(): void
    {
        $customer = User::factory()->create();
        $category = Category::create(['name' => 'Sensors', 'slug' => 'sensors']);

        $productA = Product::create([
            'category_id' => $category->id,
            'name' => 'IMU Breakout',
            'slug' => 'imu-breakout',
            'sku' => 'SKU-A',
            'price' => 9.99,
            'stock_quantity' => 10,
            'return_policy' => 'none',
            'is_active' => true,
        ]);
        $productB = Product::create([
            'category_id' => $category->id,
            'name' => 'Ultrasonic Sensor',
            'slug' => 'ultrasonic-sensor',
            'sku' => 'SKU-B',
            'price' => 4.99,
            'stock_quantity' => 10,
            'return_policy' => 'none',
            'is_active' => true,
        ]);

        $this->actingAs($customer)->post('/cart', ['product_id' => $productA->id, 'quantity' => 2]);
        $this->actingAs($customer)->post('/cart', ['product_id' => $productB->id, 'quantity' => 3]);

        $this->actingAs($customer)
            ->get('/')
            ->assertInertia(fn ($page) => $page->where('cartItemCount', 5));

        // Another customer's cart never leaks into this count.
        $otherCustomer = User::factory()->create();

        $this->actingAs($otherCustomer)
            ->get('/')
            ->assertInertia(fn ($page) => $page->where('cartItemCount', 0));
    }
}
