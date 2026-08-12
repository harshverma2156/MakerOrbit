<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    /**
     * The admin product list/management screens are for whoever can
     * curate the catalog: super admin or product manager. The public
     * storefront listing (ProductController, not this admin area) is
     * unauthenticated and unaffected by this policy.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(UserRole::SuperAdmin, UserRole::ProductManager);
    }

    public function view(User $user, Product $product): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, Product $product): bool
    {
        return $this->viewAny($user);
    }

    public function delete(User $user, Product $product): bool
    {
        return $this->viewAny($user);
    }
}
