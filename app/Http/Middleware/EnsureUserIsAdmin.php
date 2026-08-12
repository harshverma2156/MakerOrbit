<?php

namespace App\Http\Middleware;

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

        return $next($request);
    }
}
