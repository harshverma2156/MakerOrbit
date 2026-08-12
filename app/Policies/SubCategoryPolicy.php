<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\SubCategory;
use App\Models\User;

class SubCategoryPolicy
{
    /**
     * Sub-categories follow the same rule as their parent category:
     * only a super admin or product manager may manage them.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(UserRole::SuperAdmin, UserRole::ProductManager);
    }

    public function view(User $user, SubCategory $subCategory): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, SubCategory $subCategory): bool
    {
        return $this->viewAny($user);
    }

    public function delete(User $user, SubCategory $subCategory): bool
    {
        return $this->viewAny($user);
    }
}
