// ─────────────────────────────────────────────────────────────────────────────
// dashboard.ts  (Dashboard component)
// A protected page only reachable when the user is logged in (enforced by
// AuthGuard on the route). Shows the logged-in username and a logout button.
// ─────────────────────────────────────────────────────────────────────────────

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
// OnInit provides the ngOnInit() lifecycle hook, which runs once after Angular
// has set up the component — a good place to load initial data.
export class Dashboard implements OnInit {
  username = '';  // Displayed in the toolbar and welcome card.

  constructor(private authService: AuthService, private router: Router) {}

  // Runs once when the component is first created.
  ngOnInit(): void {
    // Read the username saved in localStorage during login.
    // The ?? 'User' is a fallback in case the value is null.
    this.username = this.authService.getUsername() ?? 'User';
  }

  // Called when the user clicks the logout icon in the toolbar.
  logout(): void {
    this.authService.logout();          // Clears the token from localStorage.
    this.router.navigate(['/login']);   // Redirect to the login page.
  }
}
