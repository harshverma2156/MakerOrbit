<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'sku',
        'description',
        'price',
        'stock_quantity',
        'image_path',
        'specs',
        'is_active',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'specs' => 'array',
            'is_active' => 'boolean',
            'stock_quantity' => 'integer',
        ];
    }

    /**
     * Use the slug for route model binding (e.g. /products/nema17-stepper-motor)
     * instead of the numeric id, matching how product links are built in the UI.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Get the category this product belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Whether the product currently has stock available.
     */
    public function getInStockAttribute(): bool
    {
        return $this->stock_quantity > 0;
    }
}
