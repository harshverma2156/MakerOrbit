<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTrackingTest extends TestCase
{
    use RefreshDatabase;

    private function createOrder(User $user, string $status = 'pending'): Order
    {
        return Order::create([
            'user_id' => $user->id,
            'status' => $status,
            'subtotal' => 10,
            'total' => 10,
            'shipping_address' => '123 Test Street',
        ]);
    }

    public function test_an_order_manager_can_move_an_order_to_shipped(): void
    {
        $orderManager = User::factory()->withRole('order_manager')->create();
        $customer = User::factory()->create();
        $order = $this->createOrder($customer, 'processing');

        $response = $this->actingAs($orderManager)
            ->patch(route('admin.orders.update', $order), ['status' => 'shipped']);

        $response->assertSessionHasNoErrors();
        $this->assertSame('shipped', $order->fresh()->status);
    }

    public function test_an_invalid_status_is_rejected(): void
    {
        $orderManager = User::factory()->withRole('order_manager')->create();
        $customer = User::factory()->create();
        $order = $this->createOrder($customer, 'pending');

        $response = $this->actingAs($orderManager)
            ->patch(route('admin.orders.update', $order), ['status' => 'delivered']);

        $response->assertSessionHasErrors('status');
        $this->assertSame('pending', $order->fresh()->status);
    }

    public function test_the_customer_order_page_shows_the_orders_status(): void
    {
        $customer = User::factory()->create();
        $order = $this->createOrder($customer, 'shipped');

        $response = $this->actingAs($customer)->get(route('orders.show', $order));

        $response->assertInertia(fn ($page) => $page->where('order.status', 'shipped'));
    }

    public function test_a_cancelled_order_is_reported_as_cancelled(): void
    {
        $customer = User::factory()->create();
        $order = $this->createOrder($customer, 'cancelled');

        $response = $this->actingAs($customer)->get(route('orders.show', $order));

        $response->assertInertia(fn ($page) => $page->where('order.status', 'cancelled'));
    }
}
