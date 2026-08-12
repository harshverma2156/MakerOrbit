<?php

namespace App\Http\Controllers;

use App\Support\PreviewMode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PreviewModeController extends Controller
{
    /**
     * Start previewing the site as a customer would see it. Only a real
     * staff member can enter preview mode; deliberately routed outside
     * the `admin` middleware group so this isn't itself blocked once
     * preview mode is on (see EnsureUserIsAdmin).
     */
    public function enable(Request $request): RedirectResponse
    {
        abort_unless($request->user()->isStaff(), 403);

        PreviewMode::enable($request);

        return redirect()->route('home');
    }

    /**
     * Leave preview mode and return to the admin dashboard.
     */
    public function disable(Request $request): RedirectResponse
    {
        abort_unless($request->user()->isStaff(), 403);

        PreviewMode::disable($request);

        return redirect()->route('admin.dashboard');
    }
}
