<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Create or update the current user's review for a product. Only
     * customers who actually bought it (in a non-cancelled order) may
     * review it — resubmitting the form updates the existing review
     * rather than creating a second one (see the unique index on
     * reviews.[product_id, user_id]).
     */
    public function store(Request $request, Product $product): RedirectResponse
    {
        $user = $request->user();

        $hasPurchased = OrderItem::where('product_id', $product->id)
            ->whereHas('order', function ($query) use ($user) {
                $query->where('user_id', $user->id)->where('status', '!=', 'cancelled');
            })
            ->exists();

        abort_unless($hasPurchased, 403, 'You can only review products you have purchased.');

        $data = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'title' => ['nullable', 'string', 'max:120'],
            'body' => ['nullable', 'string', 'max:2000'],
        ]);

        Review::updateOrCreate(
            ['product_id' => $product->id, 'user_id' => $user->id],
            $data,
        );

        return back()->with('success', 'Thanks for your review!');
    }

    /**
     * Delete the current user's own review.
     */
    public function destroy(Request $request, Review $review): RedirectResponse
    {
        abort_if($review->user_id !== $request->user()->id, 403);

        $review->delete();

        return back()->with('success', 'Review removed.');
    }
}
