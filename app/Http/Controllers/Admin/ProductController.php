<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * List all products for management, alongside the category/sub-category
     * tree used to populate the "Add Product" dialog's selects.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', Product::class);

        return Inertia::render('Admin/Products/Index', [
            'products' => Product::with(['category', 'subCategory'])
                ->latest()
                ->get(),
            'categories' => Category::with('subCategories')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Create a new product.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Product::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'sub_category_id' => [
                'nullable',
                'integer',
                'exists:sub_categories,id',
            ],
        ]);

        // Guard against a sub-category that belongs to a different
        // category than the one selected.
        if (! empty($data['sub_category_id'])) {
            $belongsToCategory = Category::find($data['category_id'])
                ?->subCategories()
                ->whereKey($data['sub_category_id'])
                ->exists();

            abort_unless($belongsToCategory, 422, 'That sub-category does not belong to the selected category.');
        }

        $slug = Str::slug($data['name']);

        Product::create([
            'category_id' => $data['category_id'],
            'sub_category_id' => $data['sub_category_id'] ?? null,
            'name' => $data['name'],
            'slug' => $slug,
            'sku' => Str::upper(Str::random(4)).'-'.Str::upper(Str::slug($slug, '-')),
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'stock_quantity' => 0,
            'is_active' => true,
        ]);

        return back()->with('success', 'Product added.');
    }

    /**
     * Delete a product.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $this->authorize('delete', $product);

        $product->delete();

        return back()->with('success', 'Product deleted.');
    }
}
