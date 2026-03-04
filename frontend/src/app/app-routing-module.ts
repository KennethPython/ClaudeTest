// ─────────────────────────────────────────────────────────────────────────────
// app-routing-module.ts  (AppRoutingModule)
// Defines all URL routes and which component to show for each.
// Angular's Router reads this table and swaps the component inside
// <router-outlet> when the URL changes.
// ─────────────────────────────────────────────────────────────────────────────

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login }     from './components/login/login';
import { Signup }    from './components/signup/signup';
import { Dashboard } from './components/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';

const routes: Routes = [
  // '' (empty path) immediately redirects to /login.
  // pathMatch: 'full' means the redirect only triggers for the exact empty path,
  // not for any path that starts with ''.
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Public routes — anyone can access these.
  { path: 'login',  component: Login },
  { path: 'signup', component: Signup },

  // Protected route — authGuard runs first.
  // If the user is not logged in, authGuard redirects them to /login.
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },

  // Wildcard: any unknown URL falls back to the login page.
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  // forRoot() registers the router with the app-level route table.
  // (Child modules would use forChild() instead.)
  imports: [RouterModule.forRoot(routes)],
  // Exporting RouterModule makes <router-outlet> and routerLink available
  // in any component declared in AppModule.
  exports: [RouterModule]
})
export class AppRoutingModule { }
