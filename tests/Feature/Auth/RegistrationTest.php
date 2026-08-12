<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_new_users_always_register_as_a_plain_customer(): void
    {
        $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertSame('customer', User::where('email', 'test@example.com')->first()->role->value);
    }

    public function test_a_crafted_registration_request_cannot_grant_a_staff_role(): void
    {
        $this->post('/register', [
            'name' => 'Attacker',
            'email' => 'attacker@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            // Neither field exists on the real form; both are attempts to
            // smuggle admin access in through extra POST fields.
            'role' => 'super_admin',
            'is_admin' => true,
        ]);

        $user = User::where('email', 'attacker@example.com')->first();

        $this->assertNotNull($user);
        $this->assertSame('customer', $user->role->value);
    }
}
