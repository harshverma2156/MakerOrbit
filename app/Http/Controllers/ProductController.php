<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a paginated listing of active products, with optional
     * search, category (slug), price-range, and in-stock filtering, and
     * a choice of sort order.
     *
     * The search matches more than just the product name/SKU: a term
     * that only appears in the description, or in the name of the
     * product's category/sub-category, is still a "related" result a
     * shopper would expect to see (e.g. searching "SLAM" should surface
     * a lidar module whose name doesn't contain the word).
     */
    public function index(Request $request): Response
    {
        $sort = $request->string('sort')->trim()->toString();
        $minPrice = $request->input('min_price');
        $maxPrice = $request->input('max_price');

        $query = Product::query()
            ->with(['category', 'subCategory'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->where('is_active', true)
            ->when($request->string('search')->trim()->toString(), function ($query, string $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('category', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('subCategory', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->string('category')->trim()->toString(), function ($query, string $categorySlug) {
                $query->whereHas('category', function ($query) use ($categorySlug) {
                    $query->where('slug', $categorySlug);
                });
            })
            ->when($request->string('subcategory')->trim()->toString(), function ($query, string $subCategorySlug) {
                $query->whereHas('subCategory', function ($query) use ($subCategorySlug) {
                    $query->where('slug', $subCategorySlug);
                });
            })
            ->when(is_numeric($minPrice), fn($query) => $query->where('price', '>=', (float) $minPrice))
            ->when(is_numeric($maxPrice), fn($query) => $query->where('price', '<=', (float) $maxPrice))
            ->when($request->boolean('in_stock'), fn($query) => $query->where('stock_quantity', '>', 0));

        match ($sort) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            default => $query->latest(),
        };

        $products = $query->paginate(12)->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => Category::with('subCategories')->orderBy('name')->get(),
            'filters' => $request->only(['search', 'category', 'subcategory', 'sort', 'min_price', 'max_price', 'in_stock']),
        ]);
    }

    /**
     * Display a single product, its reviews, and a handful of related
     * products from the same category.
     */
    public function show(Request $request, Product $product): Response
    {
        $product->load(['category', 'subCategory', 'images']);
        $product->loadCount('reviews');
        $product->loadAvg('reviews', 'rating');
        $product->load(['reviews' => function ($query) {
            $query->with('user:id,name')->latest();
        }]);

        $user = $request->user();

        // Reviews are gated on having actually bought the item — see
        // ReviewController::store, which enforces the same rule server
        // side; this just controls whether the form renders at all.
        $hasPurchased = $user && OrderItem::where('product_id', $product->id)
            ->whereHas('order', function ($query) use ($user) {
                $query->where('user_id', $user->id)->where('status', '!=', 'cancelled');
            })
            ->exists();

        $userReview = $user
            ? $product->reviews->firstWhere('user_id', $user->id)
            : null;

        $relatedProducts = Product::query()
            ->where('is_active', true)
            ->where('id', '!=', $product->id)
            ->where('category_id', $product->category_id)
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->inRandomOrder()
            ->limit(4)
            ->get();

        return Inertia::render('Products/Show', [
            'product' => $product,
            'hasPurchased' => $hasPurchased,
            'userReview' => $userReview,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
