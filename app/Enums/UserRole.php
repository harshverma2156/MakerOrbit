<?php

namespace App\Enums;

enum UserRole: string
{
    case Customer = 'customer';
    case SuperAdmin = 'super_admin';
    case ProductManager = 'product_manager';
    case OrderManager = 'order_manager';
    case SupportStaff = 'support_staff';

    /**
     * Human-readable label for admin UI.
     */
    public function label(): string
    {
        return match ($this) {
            self::Customer => 'Customer',
            self::SuperAdmin => 'Super Admin',
            self::ProductManager => 'Product Manager',
            self::OrderManager => 'Order Manager',
            self::SupportStaff => 'Support Staff',
        };
    }

    /**
     * Any role other than a plain customer counts as staff, i.e. it gets
     * through the perimeter check for the /admin/* area. What a given
     * staff role can actually do beyond that is decided by policies.
     */
    public function isStaff(): bool
    {
        return $this !== self::Customer;
    }

    /**
     * All roles that are not the default customer role, for admin UI
     * (e.g. the staff role picker) where "customer" isn't a valid choice.
     *
     * @return list<self>
     */
    public static function staffRoles(): array
    {
        return [
            self::SuperAdmin,
            self::ProductManager,
            self::OrderManager,
            self::SupportStaff,
        ];
    }
}
