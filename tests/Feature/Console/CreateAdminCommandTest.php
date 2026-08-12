<?php

namespace Tests\Feature\Console;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateAdminCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_promotes_an_existing_user_to_the_given_role(): void
    {
        $user = User::factory()->create();

        $this->artisan('admin:create', ['email' => $user->email, '--role' => 'order_manager'])
            ->expectsConfirmation(
                "Promote {$user->email} ({$user->name}), currently customer, to order_manager?",
                'yes',
            )
            ->assertSuccessful();

        $this->assertSame('order_manager', $user->fresh()->role->value);
    }

    public function test_it_refuses_to_grant_a_non_staff_role(): void
    {
        $user = User::factory()->create();

        // "customer" is not a valid --role option, so the command falls
        // back to asking for one of its staff roles instead of silently
        // accepting a non-staff value.
        $this->artisan('admin:create', ['email' => $user->email, '--role' => 'customer'])
            ->expectsChoice(
                'Select a role',
                'super_admin',
                ['super_admin', 'product_manager', 'order_manager', 'support_staff'],
            )
            ->expectsConfirmation(
                "Promote {$user->email} ({$user->name}), currently customer, to super_admin?",
                'yes',
            )
            ->assertSuccessful();

        $this->assertNotSame('customer', $user->fresh()->role->value);
    }

    public function test_it_creates_a_new_admin_account_interactively_without_cli_password_args(): void
    {
        $this->artisan('admin:create', ['email' => 'newadmin@example.com', '--role' => 'super_admin'])
            ->expectsQuestion('Name', 'New Admin')
            ->expectsQuestion('Password (input hidden)', 'a-strong-password')
            ->expectsQuestion('Confirm password', 'a-strong-password')
            ->assertSuccessful();

        $user = User::where('email', 'newadmin@example.com')->first();

        $this->assertNotNull($user);
        $this->assertSame('super_admin', $user->role->value);
        $this->assertNotNull($user->email_verified_at);
        $this->assertTrue(\Illuminate\Support\Facades\Hash::check('a-strong-password', $user->password));
    }

    public function test_it_fails_when_password_confirmation_does_not_match(): void
    {
        $this->artisan('admin:create', ['email' => 'newadmin@example.com', '--role' => 'super_admin'])
            ->expectsQuestion('Name', 'New Admin')
            ->expectsQuestion('Password (input hidden)', 'a-strong-password')
            ->expectsQuestion('Confirm password', 'a-different-password')
            ->assertFailed();

        $this->assertNull(User::where('email', 'newadmin@example.com')->first());
    }
}
