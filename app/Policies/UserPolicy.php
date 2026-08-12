<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\User;

class UserPolicy
{
    /**
     * Only a super admin can see the staff list / assign roles.
     * Product managers, order managers, and support staff cannot
     * grant themselves or anyone else more access.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === UserRole::SuperAdmin;
    }

    public function update(User $user, User $target): bool
    {
        return $user->role === UserRole::SuperAdmin;
    }
}
