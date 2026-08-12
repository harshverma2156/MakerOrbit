<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the marketing home page with a handful of featured products.
     */
    public function index(): Response
    {
        $featuredProducts = Product::with(['category', 'images'])
            ->where('is_active', true)
            ->inRandomOrder()
            ->limit(5)
            ->get();

        return Inertia::render('Home', [
            'featuredProducts' => $featuredProducts,
        ]);
    }
}
