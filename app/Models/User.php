<?php

namespace App\Models;

use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * Deliberately excludes `role`: it must never be settable via mass
     * assignment (e.g. from the public registration form), only through
     * the admin staff-management flow, which sets it explicitly.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * Default attribute values.
     *
     * `role` has a NOT NULL DEFAULT 'customer' at the database level, but
     * Eloquent never syncs DB-applied column defaults back into a model
     * instance after INSERT — only an explicit refresh/re-fetch would.
     * Without this, a just-created User held in memory (e.g. immediately
     * after `User::create()` + `Auth::login()` in registration, or a
     * factory-built user in tests) has no `role` attribute at all, and
     * casting a missing value through the UserRole enum cast yields null
     * rather than UserRole::Customer. Declaring it here keeps every fresh
     * instance consistent with the database default without touching
     * $fillable (mass assignment still can't set it).
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'role' => 'customer',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
        ];
    }

    /**
     * Whether this user has any staff role (i.e. is not a plain customer).
     * This is the coarse "can enter /admin/*" check; policies decide what
     * a given staff role can actually do once inside.
     */
    public function isStaff(): bool
    {
        return $this->role->isStaff();
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === UserRole::SuperAdmin;
    }

    public function hasAnyRole(UserRole ...$roles): bool
    {
        return in_array($this->role, $roles, true);
    }
}
