<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PreviewModeTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_enable_or_disable_preview_mode(): void
    {
        $this->post('/preview-mode/customer')->assertRedirect(route('login'));
        $this->post('/preview-mode/admin')->assertRedirect(route('login'));
    }

    public function test_plain_customer_cannot_enable_preview_mode(): void
    {
        $customer = User::factory()->create();

        $this->actingAs($customer)
            ->post('/preview-mode/customer')
            ->assertForbidden();
    }

    public function test_staff_can_switch_into_preview_mode_and_back(): void
    {
        $admin = User::factory()->withRole('super_admin')->create();

        $this->actingAs($admin)
            ->post('/preview-mode/customer')
            ->assertRedirect(route('home'));

        $this->assertTrue(session('previewing_as_customer'));

        $this->actingAs($admin)
            ->post('/preview-mode/admin')
            ->assertRedirect(route('admin.dashboard'));

        $this->assertFalse(session()->has('previewing_as_customer'));
    }

    public function test_admin_routes_are_blocked_while_previewing_as_customer(): void
    {
        $admin = User::factory()->withRole('super_admin')->create();

        $this->actingAs($admin)->post('/preview-mode/customer');

        $this->actingAs($admin)
            ->get('/admin')
            ->assertRedirect(route('home'));

        $this->actingAs($admin)
            ->get('/admin/products')
            ->assertRedirect(route('home'));
    }

    public function test_admin_access_is_restored_after_switching_back(): void
    {
        $admin = User::factory()->withRole('super_admin')->create();

        $this->actingAs($admin)->post('/preview-mode/customer');
        $this->actingAs($admin)->post('/preview-mode/admin');

        $this->actingAs($admin)->get('/admin')->assertOk();
    }

    public function test_inertia_shared_prop_reflects_preview_state(): void
    {
        $admin = User::factory()->withRole('super_admin')->create();

        $this->actingAs($admin)
            ->get('/')
            ->assertInertia(fn ($page) => $page->where('previewingAsCustomer', false));

        $this->actingAs($admin)->post('/preview-mode/customer');

        $this->actingAs($admin)
            ->get('/')
            ->assertInertia(fn ($page) => $page->where('previewingAsCustomer', true));
    }

    public function test_preview_mode_never_appears_for_a_plain_customer(): void
    {
        $customer = User::factory()->create();

        $this->actingAs($customer)
            ->get('/')
            ->assertInertia(fn ($page) => $page->where('previewingAsCustomer', false));
    }
}
