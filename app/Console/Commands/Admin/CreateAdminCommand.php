<?php

namespace App\Console\Commands\Admin;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class CreateAdminCommand extends Command
{
    /**
     * Promotes an existing user to a staff role, or creates a new admin
     * user interactively. This is the only supported way to grant staff
     * access — there is no public page or route that can do this, and
     * no seeder ships a hard-coded admin account or credentials.
     *
     * Usage:
     *   php artisan admin:create you@example.com
     *   php artisan admin:create you@example.com --role=order_manager
     */
    protected $signature = 'admin:create {email?} {--role=super_admin}';

    protected $description = 'Grant an existing user a staff role, or create a new admin account interactively';

    public function handle(): int
    {
        $email = $this->argument('email') ?? $this->ask('Email address of the admin account');

        $emailValidator = Validator::make(['email' => $email], ['email' => ['required', 'email']]);

        if ($emailValidator->fails()) {
            $this->error($emailValidator->errors()->first('email'));

            return self::FAILURE;
        }

        $staffRoleValues = array_map(fn (UserRole $role) => $role->value, UserRole::staffRoles());
        $role = $this->option('role');

        if (! in_array($role, $staffRoleValues, true)) {
            $role = $this->choice('Select a role', $staffRoleValues, 0);
        }

        $user = User::where('email', $email)->first();

        if ($user) {
            return $this->promote($user, $role);
        }

        return $this->createNew($email, $role);
    }

    private function promote(User $user, string $role): int
    {
        if ($user->role->value === $role) {
            $this->info("{$user->email} already has the {$role} role.");

            return self::SUCCESS;
        }

        if (! $this->confirm("Promote {$user->email} ({$user->name}), currently {$user->role->value}, to {$role}?", true)) {
            $this->warn('Cancelled — no changes made.');

            return self::SUCCESS;
        }

        // `role` is deliberately excluded from User::$fillable so it can
        // never be set via mass assignment from user-facing requests.
        // This command is a trusted, explicitly-invoked path, so it's
        // assigned directly rather than through update()/fill().
        $user->role = $role;
        $user->save();

        $this->info("{$user->email} is now {$role}.");

        return self::SUCCESS;
    }

    private function createNew(string $email, string $role): int
    {
        $this->info("No existing user found for {$email} — creating a new account.");

        $name = $this->ask('Name');

        // Never accept a password as a CLI argument/option: it would be
        // readable in shell history and the process list. Prompt for it
        // with hidden input instead.
        $password = $this->secret('Password (input hidden)');
        $confirmation = $this->secret('Confirm password');

        if ($password !== $confirmation) {
            $this->error('Passwords did not match.');

            return self::FAILURE;
        }

        $validator = Validator::make(
            ['name' => $name, 'password' => $password],
            [
                'name' => ['required', 'string', 'max:255'],
                'password' => ['required', Password::defaults()],
            ],
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $message) {
                $this->error($message);
            }

            return self::FAILURE;
        }

        $user = new User;
        $user->name = $name;
        $user->email = $email;
        $user->password = Hash::make($password);
        $user->email_verified_at = now(); // Admin-created and confirmed interactively; trusted.
        $user->role = $role;
        $user->save();

        $this->info("Created admin account {$user->email} with role {$role}.");

        return self::SUCCESS;
    }
}
