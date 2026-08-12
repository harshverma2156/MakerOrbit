<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /**
     * Display the current user's cart.
     */
    public function index(Request $request): Response
    {
        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);
        $cart->load('items.product');

        return Inertia::render('Cart/Index', [
            'cart' => $cart,
        ]);
    }

    /**
     * Add a product to the current user's cart, incrementing the
     * quantity if it is already present.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);

        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $data['product_id'])
            ->first();

        if ($item) {
            $item->quantity += $data['quantity'];
            $item->save();
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $data['product_id'],
                'quantity' => $data['quantity'],
            ]);
        }

        return back()->with('success', 'Added to cart.');
    }

    /**
     * Update the quantity of a cart item belonging to the current user.
     */
    public function update(Request $request, CartItem $cartItem): RedirectResponse
    {
        abort_if($cartItem->cart->user_id !== $request->user()->id, 403);

        $data = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cartItem->update(['quantity' => $data['quantity']]);

        return back()->with('success', 'Cart updated.');
    }

    /**
     * Remove a cart item belonging to the current user.
     */
    public function destroy(Request $request, CartItem $cartItem): RedirectResponse
    {
        abort_if($cartItem->cart->user_id !== $request->user()->id, 403);

        $cartItem->delete();

        return back()->with('success', 'Item removed from cart.');
    }
}
