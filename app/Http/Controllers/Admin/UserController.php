<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * List every user and their role, so a super admin can promote a
     * customer to staff or change an existing staff member's role.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', User::class);

        return Inertia::render('Admin/Staff/Index', [
            'users' => User::orderByDesc('created_at')->get(['id', 'name', 'email', 'role']),
            'roles' => array_map(
                fn (UserRole $role) => ['value' => $role->value, 'label' => $role->label()],
                UserRole::cases(),
            ),
        ]);
    }

    /**
     * Change a user's role.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $data = $request->validate([
            'role' => ['required', Rule::in(array_map(fn ($role) => $role->value, UserRole::cases()))],
        ]);

        // Guard against a super admin locking everyone out by demoting
        // themselves (or being demoted) when they're the last one.
        if (
            $user->role === UserRole::SuperAdmin
            && $data['role'] !== UserRole::SuperAdmin->value
            && User::where('role', UserRole::SuperAdmin->value)->count() <= 1
        ) {
            return back()->withErrors([
                'role' => 'You cannot remove the last super admin.',
            ]);
        }

        // `role` is deliberately excluded from User::$fillable so it can
        // never be set via mass assignment (e.g. a crafted registration
        // request). This is the one trusted, authorized path allowed to
        // set it, so it's assigned directly rather than through update().
        $user->role = $data['role'];
        $user->save();

        return back()->with('success', "{$user->name}'s role updated.");
    }
}
