<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'category_id',
        'sub_category_id',
        'name',
        'slug',
        'sku',
        'description',
        'features',
        'price',
        'mrp',
        'stock_quantity',
        'image_path',
        'specs',
        'specification_url',
        'cod_available',
        'return_policy',
        'return_window_days',
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
            'mrp' => 'decimal:2',
            'specs' => 'array',
            'features' => 'array',
            'cod_available' => 'boolean',
            'is_active' => 'boolean',
            'stock_quantity' => 'integer',
            'return_window_days' => 'integer',
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
     * Get the sub-category this product belongs to.
     */
    public function subCategory(): BelongsTo
    {
        return $this->belongsTo(SubCategory::class);
    }

    /**
     * Get this product's photos (up to 5), in display order.
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    /**
     * Get this product's customer reviews.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Whether the product currently has stock available.
     */
    public function getInStockAttribute(): bool
    {
        return $this->stock_quantity > 0;
    }

    /**
     * Percentage off the MRP the current price represents, rounded to
     * the nearest whole percent. Null when there's no MRP to compare
     * against, or the current price isn't actually a discount.
     */
    public function getDiscountPercentAttribute(): ?int
    {
        if (! $this->mrp || (float) $this->mrp <= (float) $this->price) {
            return null;
        }

        return (int) round((1 - ((float) $this->price / (float) $this->mrp)) * 100);
    }

    /**
     * Whether this product can be returned and/or replaced at all.
     */
    public function getIsReturnableAttribute(): bool
    {
        return in_array($this->return_policy, ['returnable', 'both'], true);
    }

    public function getIsReplaceableAttribute(): bool
    {
        return in_array($this->return_policy, ['replaceable', 'both'], true);
    }
}
