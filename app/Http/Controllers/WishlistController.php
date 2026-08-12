<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\WishlistItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    /**
     * The current user's saved-for-later products, newest first.
     */
    public function index(Request $request): Response
    {
        $items = WishlistItem::where('user_id', $request->user()->id)
            ->with(['product' => function ($query) {
                $query->with('category')->withAvg('reviews', 'rating')->withCount('reviews');
            }])
            ->latest()
            ->get();

        return Inertia::render('Wishlist/Index', [
            // A product can vanish (deleted) while still referenced by a
            // wishlist row; drop those rather than rendering a blank card.
            'products' => $items->pluck('product')->filter()->values(),
        ]);
    }

    /**
     * Save a product to the current user's wishlist. Idempotent — saving
     * an already-saved product is a no-op, not an error.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
        ]);

        WishlistItem::firstOrCreate([
            'user_id' => $request->user()->id,
            'product_id' => $data['product_id'],
        ]);

        return back()->with('success', 'Saved to your wishlist.');
    }

    /**
     * Remove a product from the current user's wishlist. Scoped to the
     * current user, so there's nothing to authorize — the query simply
     * can't touch anyone else's row.
     */
    public function destroy(Request $request, Product $product): RedirectResponse
    {
        WishlistItem::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->delete();

        return back()->with('success', 'Removed from your wishlist.');
    }
}
