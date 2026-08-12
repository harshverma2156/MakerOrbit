<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WishlistItem extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
    ];

    /**
     * The user who saved this product for later.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The saved product.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
