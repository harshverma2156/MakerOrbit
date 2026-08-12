<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    /**
     * The admin "all orders" list: super admin, order manager, and
     * support staff (read access, to help customers) can see it.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(
            UserRole::SuperAdmin,
            UserRole::OrderManager,
            UserRole::SupportStaff,
        );
    }

    /**
     * A single order is visible to the staff roles above, or to the
     * customer who placed it. Used by both the admin order screen and
     * the customer-facing "my orders" show page.
     */
    public function view(User $user, Order $order): bool
    {
        return $this->viewAny($user) || $user->id === $order->user_id;
    }

    /**
     * Only super admin and order manager can change an order's status;
     * support staff has read-only access.
     */
    public function update(User $user, Order $order): bool
    {
        return $user->hasAnyRole(UserRole::SuperAdmin, UserRole::OrderManager);
    }
}
