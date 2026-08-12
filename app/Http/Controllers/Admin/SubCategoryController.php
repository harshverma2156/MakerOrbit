<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SubCategoryController extends Controller
{
    /**
     * Create a new sub-category under the given category.
     */
    public function store(Request $request, Category $category): RedirectResponse
    {
        $this->authorize('create', SubCategory::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $category->subCategories()->create([
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
        ]);

        return back()->with('success', 'Sub-category created.');
    }

    /**
     * Delete a sub-category. Products referencing it fall back to
     * having no sub-category rather than being deleted (see migration).
     */
    public function destroy(SubCategory $subCategory): RedirectResponse
    {
        $this->authorize('delete', $subCategory);

        $subCategory->delete();

        return back()->with('success', 'Sub-category deleted.');
    }
}
