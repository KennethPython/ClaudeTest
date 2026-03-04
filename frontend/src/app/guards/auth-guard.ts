// ─────────────────────────────────────────────────────────────────────────────
// auth-guard.ts  (authGuard)
// A route guard that blocks navigation to protected pages (e.g. /dashboard)
// when the user is not logged in.
//
// Written as a CanActivateFn (functional guard) — the recommended style in
// Angular 15+. inject() fetches services without needing a constructor.
// Angular calls this function before loading any route that lists it in
// its canActivate array. Returning false cancels the navigation.
// ─────────────────────────────────────────────────────────────────────────────

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);  // Get the shared AuthService instance.
  const router      = inject(Router);       // Get the Router to redirect if needed.

  if (authService.isLoggedIn()) {
    // Token exists in localStorage — allow navigation.
    return true;
  }

  // No token — redirect to login and block navigation to the protected page.
  return router.createUrlTree(['/login']);
};
