<?php

namespace App\Http\Middleware;

use App\Support\PreviewMode;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * Perimeter check for the whole /admin/* area: any staff role (super
     * admin, product manager, order manager, support staff) gets past
     * this gate. Assumes 'auth' has already run, so a user is present.
     * What a given role can actually see/do once inside is then decided
     * per-resource by policies (see app/Policies).
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->isStaff()) {
            abort(403, 'You do not have access to this page.');
        }

        // Staff testing "how does this look to a customer" via preview
        // mode shouldn't still be able to act as an admin in the same
        // breath — send them back out until they explicitly switch back.
        if (PreviewMode::isActive($request)) {
            return redirect()
                ->route('home')
                ->with('status', "You're previewing as a customer. Switch back to Admin to use the admin area.");
        }

        return $next($request);
    }
}
