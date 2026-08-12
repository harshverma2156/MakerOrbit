<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    private const RETURN_POLICIES = ['none', 'returnable', 'replaceable', 'both'];

    /**
     * List all products for management.
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
     * Show the full-page "Add Product" form.
     */
    public function create(): Response
    {
        $this->authorize('create', Product::class);

        return Inertia::render('Admin/Products/Create', [
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
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'sub_category_id' => ['nullable', 'integer', 'exists:sub_categories,id'],
            'features' => ['nullable', 'array', 'max:20'],
            'features.*' => ['string', 'max:150'],
            'description' => ['nullable', 'string', 'max:10000'],
            'images' => ['nullable', 'array', 'max:5'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'specification_url' => ['nullable', 'url', 'max:2048'],
            'return_policy' => ['required', Rule::in(self::RETURN_POLICIES)],
            'return_window_days' => [
                'nullable',
                'integer',
                'min:1',
                'max:365',
                Rule::requiredIf(fn () => $request->input('return_policy') !== 'none'),
            ],
            'mrp' => ['nullable', 'numeric', 'min:0', 'gte:price'],
            'price' => ['required', 'numeric', 'min:0'],
            'cod_available' => ['nullable', 'boolean'],
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

        // Store uploaded images before opening the DB transaction, so we
        // have real paths to either save or clean up.
        $storedPaths = [];

        foreach ($request->file('images', []) as $image) {
            $storedPaths[] = $image->store('products', 'public');
        }

        $codAvailable = $request->boolean('cod_available', true);

        try {
            $product = DB::transaction(function () use ($data, $storedPaths, $codAvailable) {
                $slug = Str::slug($data['name']);

                $product = Product::create([
                    'category_id' => $data['category_id'],
                    'sub_category_id' => $data['sub_category_id'] ?? null,
                    'name' => $data['name'],
                    'slug' => $slug,
                    'sku' => Str::upper(Str::random(4)).'-'.Str::upper(Str::slug($slug, '-')),
                    'description' => $data['description'] ?? null,
                    'features' => $data['features'] ?? [],
                    'price' => $data['price'],
                    'mrp' => $data['mrp'] ?? null,
                    'stock_quantity' => 0,
                    'image_path' => $storedPaths ? Storage::url($storedPaths[0]) : null,
                    'specification_url' => $data['specification_url'] ?? null,
                    'cod_available' => $codAvailable,
                    'return_policy' => $data['return_policy'],
                    'return_window_days' => $data['return_policy'] === 'none'
                        ? null
                        : $data['return_window_days'],
                    'is_active' => true,
                ]);

                foreach ($storedPaths as $index => $path) {
                    $product->images()->create([
                        'path' => $path,
                        'sort_order' => $index,
                    ]);
                }

                return $product;
            });
        } catch (\Throwable $e) {
            foreach ($storedPaths as $path) {
                Storage::disk('public')->delete($path);
            }

            throw $e;
        }

        return redirect()
            ->route('admin.products.index')
            ->with('success', "{$product->name} added.");
    }

    /**
     * Delete a product.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $this->authorize('delete', $product);

        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->path);
        }

        $product->delete();

        return back()->with('success', 'Product deleted.');
    }
}
