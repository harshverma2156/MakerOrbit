<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Give the created user a specific role.
     *
     * `role` is deliberately excluded from User::$fillable, so passing it
     * through `create(['role' => ...])` directly would be silently
     * dropped. This state assigns it after creation instead, the same
     * trusted, explicit way the admin staff-management flow does.
     */
    public function withRole(UserRole|string $role): static
    {
        return $this->afterCreating(function (User $user) use ($role) {
            $user->role = $role instanceof UserRole ? $role : UserRole::from($role);
            $user->save();
        });
    }
}
