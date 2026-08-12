<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
    ];

    /**
     * The user that owns this cart.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The line items in this cart.
     */
    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Sum of (product price * quantity) across the loaded cart items.
     * Expects `items.product` to already be eager loaded for efficiency,
     * but will lazy load if not.
     */
    public function subtotal(): float
    {
        return $this->items->sum(function (CartItem $item) {
            return (float) $item->product->price * $item->quantity;
        });
    }
}
