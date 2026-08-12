<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductImage extends Model
{
    protected $fillable = [
        'product_id',
        'path',
        'sort_order',
    ];

    /**
     * `url` is computed (see getUrlAttribute below), not a real column.
     * Appending it is cheap here — at most 5 images load per product —
     * unlike Product's own accessors, which are left for the frontend
     * to compute since those load in bulk on listing pages.
     *
     * @var list<string>
     */
    protected $appends = ['url'];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    /**
     * The public URL for this image, suitable for use directly in an
     * <img src>. Stored path is relative to the "public" disk.
     */
    public function getUrlAttribute(): string
    {
        return asset('storage/'.$this->path);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
