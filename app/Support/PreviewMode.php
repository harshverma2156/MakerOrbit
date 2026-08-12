<?php

namespace App\Support;

use Illuminate\Http\Request;

/**
 * Thin helper around the session flag that backs the admin "preview as
 * customer" toggle (see PreviewModeController, EnsureUserIsAdmin, and
 * HandleInertiaRequests). Centralised here so the session key only
 * lives in one place instead of being copy-pasted across those three.
 *
 * Deliberately session-only: it never touches the user's real `role`
 * column, and it clears itself automatically on logout, since logging
 * out invalidates the session.
 */
class PreviewMode
{
    private const SESSION_KEY = 'previewing_as_customer';

    public static function isActive(Request $request): bool
    {
        return (bool) $request->session()->get(self::SESSION_KEY, false);
    }

    public static function enable(Request $request): void
    {
        $request->session()->put(self::SESSION_KEY, true);
    }

    public static function disable(Request $request): void
    {
        $request->session()->forget(self::SESSION_KEY);
    }
}
