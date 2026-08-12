<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a paginated listing of active products, with optional
     * search (name/sku) and category (slug) filtering.
     */
    public function index(Request $request): Response
    {
        $products = Product::query()
            ->with('category')
            ->where('is_active', true)
            ->when($request->string('search')->trim()->toString(), function ($query, string $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%");
                });
            })
            ->when($request->string('category')->trim()->toString(), function ($query, string $categorySlug) {
                $query->whereHas('category', function ($query) use ($categorySlug) {
                    $query->where('slug', $categorySlug);
                });
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => Category::all(),
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    /**
     * Display a single product.
     */
    public function show(Product $product): Response
    {
        return Inertia::render('Products/Show', [
            'product' => $product->load('category'),
        ]);
    }
}
