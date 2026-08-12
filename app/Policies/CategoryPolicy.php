<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\User;

class CategoryPolicy
{
    /**
     * Categories and their sub-categories are catalog structure: only
     * a super admin or product manager may see/manage them.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(UserRole::SuperAdmin, UserRole::ProductManager);
    }

    public function view(User $user, Category $category): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, Category $category): bool
    {
        return $this->viewAny($user);
    }

    public function delete(User $user, Category $category): bool
    {
        return $this->viewAny($user);
    }
}
