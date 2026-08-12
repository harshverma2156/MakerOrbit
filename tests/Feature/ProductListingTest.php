<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductListingTest extends TestCase
{
    use RefreshDatabase;

    private function makeProduct(Category $category, array $attributes): Product
    {
        return Product::create(array_merge([
            'category_id' => $category->id,
            'price' => 10,
            'is_active' => true,
        ], $attributes));
    }

    public function test_default_sort_is_newest_first(): void
    {
        $category = Category::create(['name' => 'Motors', 'slug' => 'motors']);

        $older = $this->makeProduct($category, [
            'name' => 'Older Motor', 'slug' => 'older-motor', 'sku' => 'OLD-1', 'price' => 10,
        ]);
        $older->forceFill(['created_at' => now()->subDay()])->save();

        $newer = $this->makeProduct($category, [
            'name' => 'Newer Motor', 'slug' => 'newer-motor', 'sku' => 'NEW-1', 'price' => 10,
        ]);

        $response = $this->get(route('products.index'));

        $response->assertInertia(fn ($page) => $page
            ->where('products.data.0.id', $newer->id)
            ->where('products.data.1.id', $older->id)
        );
    }

    public function test_sort_by_price_ascending(): void
    {
        $category = Category::create(['name' => 'Motors', 'slug' => 'motors']);

        $cheap = $this->makeProduct($category, ['name' => 'Cheap', 'slug' => 'cheap', 'sku' => 'CHEAP', 'price' => 5]);
        $expensive = $this->makeProduct($category, ['name' => 'Expensive', 'slug' => 'expensive', 'sku' => 'EXP', 'price' => 50]);

        $response = $this->get(route('products.index', ['sort' => 'price_asc']));

        $response->assertInertia(fn ($page) => $page
            ->where('products.data.0.id', $cheap->id)
            ->where('products.data.1.id', $expensive->id)
        );
    }

    public function test_sort_by_price_descending(): void
    {
        $category = Category::create(['name' => 'Motors', 'slug' => 'motors']);

        $cheap = $this->makeProduct($category, ['name' => 'Cheap', 'slug' => 'cheap', 'sku' => 'CHEAP', 'price' => 5]);
        $expensive = $this->makeProduct($category, ['name' => 'Expensive', 'slug' => 'expensive', 'sku' => 'EXP', 'price' => 50]);

        $response = $this->get(route('products.index', ['sort' => 'price_desc']));

        $response->assertInertia(fn ($page) => $page
            ->where('products.data.0.id', $expensive->id)
            ->where('products.data.1.id', $cheap->id)
        );
    }

    public function test_price_range_filter(): void
    {
        $category = Category::create(['name' => 'Motors', 'slug' => 'motors']);

        $cheap = $this->makeProduct($category, ['name' => 'Cheap', 'slug' => 'cheap', 'sku' => 'CHEAP', 'price' => 5]);
        $mid = $this->makeProduct($category, ['name' => 'Mid', 'slug' => 'mid', 'sku' => 'MID', 'price' => 25]);
        $expensive = $this->makeProduct($category, ['name' => 'Expensive', 'slug' => 'expensive', 'sku' => 'EXP', 'price' => 50]);

        $response = $this->get(route('products.index', ['min_price' => 10, 'max_price' => 30]));

        $response->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.id', $mid->id)
        );
    }

    public function test_in_stock_only_filter(): void
    {
        $category = Category::create(['name' => 'Motors', 'slug' => 'motors']);

        $inStock = $this->makeProduct($category, [
            'name' => 'In Stock', 'slug' => 'in-stock', 'sku' => 'IN', 'price' => 10, 'stock_quantity' => 5,
        ]);
        $outOfStock = $this->makeProduct($category, [
            'name' => 'Out of Stock', 'slug' => 'out-of-stock', 'sku' => 'OUT', 'price' => 10, 'stock_quantity' => 0,
        ]);

        $response = $this->get(route('products.index', ['in_stock' => 1]));

        $response->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.id', $inStock->id)
        );
    }

    public function test_listing_includes_average_rating_and_review_count(): void
    {
        $category = Category::create(['name' => 'Motors', 'slug' => 'motors']);
        $product = $this->makeProduct($category, [
            'name' => 'Reviewed Motor', 'slug' => 'reviewed-motor', 'sku' => 'REV', 'price' => 10,
        ]);
        $reviewer = User::factory()->create();
        Review::create(['product_id' => $product->id, 'user_id' => $reviewer->id, 'rating' => 5]);

        $response = $this->get(route('products.index'));

        $response->assertInertia(fn ($page) => $page
            ->where('products.data.0.reviews_count', 1)
            ->where('products.data.0.reviews_avg_rating', fn ($value) => abs($value - 5.0) < 0.01)
        );
    }

    public function test_related_products_come_from_the_same_category_and_exclude_the_product_itself(): void
    {
        $category = Category::create(['name' => 'Sensors', 'slug' => 'sensors']);
        $otherCategory = Category::create(['name' => 'Motors', 'slug' => 'motors']);

        $product = $this->makeProduct($category, [
            'name' => 'Main Sensor', 'slug' => 'main-sensor', 'sku' => 'MAIN',
        ]);
        $sameCategory = $this->makeProduct($category, [
            'name' => 'Sibling Sensor', 'slug' => 'sibling-sensor', 'sku' => 'SIB',
        ]);
        // Exists only to prove it's excluded from `relatedProducts` below.
        $this->makeProduct($otherCategory, [
            'name' => 'Unrelated Motor', 'slug' => 'unrelated-motor', 'sku' => 'UNREL',
        ]);

        $response = $this->get(route('products.show', $product));

        $response->assertInertia(function ($page) use ($sameCategory) {
            $page->has('relatedProducts', 1);
            $page->where('relatedProducts.0.id', $sameCategory->id);

            return $page;
        });
    }

    public function test_related_products_excludes_inactive_products(): void
    {
        $category = Category::create(['name' => 'Sensors', 'slug' => 'sensors']);

        $product = $this->makeProduct($category, [
            'name' => 'Main Sensor', 'slug' => 'main-sensor', 'sku' => 'MAIN',
        ]);
        $this->makeProduct($category, [
            'name' => 'Inactive Sibling', 'slug' => 'inactive-sibling', 'sku' => 'INACTIVE', 'is_active' => false,
        ]);

        $response = $this->get(route('products.show', $product));

        $response->assertInertia(fn ($page) => $page->has('relatedProducts', 0));
    }
}
