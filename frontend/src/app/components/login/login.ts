// ─────────────────────────────────────────────────────────────────────────────
// login.ts  (Login component)
// Controls the login page. Builds a reactive form, validates it, calls the
// auth service, and navigates to /dashboard on success.
// ─────────────────────────────────────────────────────────────────────────────

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

// @Component links this class to its HTML template and SCSS stylesheet.
// selector: 'app-login' is the HTML tag used to embed this component.
// standalone: false means it belongs to a NgModule (AppModule).
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;      // The reactive form object bound to the template.
  errorMessage = '';         // Shown in red when the API call fails.
  loading = false;           // Disables the button while the request is in-flight.
  hidePassword = true;       // Toggles the password field between text and dots.

  // Angular injects FormBuilder, AuthService, and Router automatically.
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // fb.group() creates the form with two controls.
    // Validators.required means the field must not be empty.
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Called when the user clicks "Sign In".
  onSignIn(): void {
    // Guard: do nothing if either field is empty (form is invalid).
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    // loginForm.value contains { username, password } matching LoginRequest.
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        // Login succeeded — navigate to the dashboard.
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        // API returned an error (e.g. 401 Unauthorized).
        this.errorMessage = 'Invalid username or password.';
        this.loading = false;
      }
    });
  }

  // Called when the user clicks "Sign Up" — just navigate to the signup page.
  onSignUp(): void {
    this.router.navigate(['/signup']);
  }
}
