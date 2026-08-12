<?php

namespace App\Http\Middleware;

use App\Models\CartItem;
use App\Models\Category;
use App\Models\WishlistItem;
use App\Support\PreviewMode;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            // Explicit whitelist rather than serializing the raw model:
            // relying only on User::$hidden would silently start leaking
            // any sensitive column added to the table in the future.
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role->value,
                    'email_verified_at' => $user->email_verified_at,
                ] : null,
            ],
            // Real role never changes here — this only tells the nav
            // whether a staff member has temporarily switched to the
            // customer view for testing (see PreviewModeController).
            'previewingAsCustomer' => $user?->isStaff() && PreviewMode::isActive($request),
            // Powers the top-nav "hover a category, see its sub-categories"
            // menu on every page, without every controller needing to load it.
            'categoryNav' => fn () => Category::with('subCategories')
                ->orderBy('name')
                ->get(['id', 'name', 'slug']),
            // Powers the cart icon badge in the header on every page.
            'cartItemCount' => fn () => $user
                ? (int) CartItem::whereHas('cart', fn ($query) => $query->where('user_id', $user->id))->sum('quantity')
                : 0,
            // Lets product cards/pages render a filled vs. outline heart
            // without every controller needing to load it.
            'wishlistProductIds' => fn () => $user
                ? WishlistItem::where('user_id', $user->id)->pluck('product_id')
                : [],
        ];
    }
}
