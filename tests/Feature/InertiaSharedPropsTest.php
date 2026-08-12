<?php

namespace Tests\Feature;

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
}
