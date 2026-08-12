<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * List every order in the system, newest first. Visible to super
     * admin, order manager, and support staff (read access).
     */
    public function index(): Response
    {
        $this->authorize('viewAny', Order::class);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => Order::with('user:id,name,email')
                ->orderByDesc('created_at')
                ->paginate(15),
        ]);
    }

    /**
     * Show a single order with its line items and the customer who
     * placed it.
     */
    public function show(Order $order): Response
    {
        $this->authorize('view', $order);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order->load(['items', 'user:id,name,email']),
            'canUpdateStatus' => request()->user()->can('update', $order),
        ]);
    }

    /**
     * Update an order's status. Restricted to super admin and order
     * manager; support staff has read-only access (see OrderPolicy).
     */
    public function update(Request $request, Order $order): RedirectResponse
    {
        $this->authorize('update', $order);

        $data = $request->validate([
            'status' => ['required', 'in:pending,processing,shipped,completed,cancelled'],
        ]);

        $order->update(['status' => $data['status']]);

        return back()->with('success', 'Order status updated.');
    }
}
