<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * The admin landing page: a hub of cards (Categories, Sub-Category,
     * Products, Orders, Staff) linking to each management area. Which
     * cards are actionable is decided client-side from the user's role,
     * but every underlying route/action is still policy-gated server-side
     * regardless of what the UI shows.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Admin/Dashboard', [
            // Only fetched when useful, for the "Sub-Category" card's
            // quick-create dialog (its category dropdown).
            'categories' => $user->can('viewAny', Category::class)
                ? Category::orderBy('name')->get(['id', 'name'])
                : [],
        ]);
    }
}
