// ─────────────────────────────────────────────────────────────────────────────
// signup.ts  (Signup component)
// Controls the sign-up page. Contains two custom validators:
//   1. passwordComplexityValidator — checks length, number, and special char.
//   2. passwordsMatchValidator     — checks both password fields are identical.
// On success it redirects to /login so the user signs in with their new account.
// ─────────────────────────────────────────────────────────────────────────────

import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

// ── Custom validator: password complexity ─────────────────────────────────────
// Angular validators are plain functions. They receive the FormControl and must
// return null (valid) or an object describing the error (invalid).
function passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value ?? '';  // Default to empty string if null.
  const hasMinLength = value.length >= 8;
  const hasNumber    = /\d/.test(value);       // \d matches any digit 0-9.
  const hasSpecial   = /[!@#$%^&*()_+\-=\[\]{};':"\|,.<>\/?]/.test(value);

  if (!hasMinLength || !hasNumber || !hasSpecial) {
    // Return an error key; the template checks for 'passwordComplexity'.
    return { passwordComplexity: true };
  }
  return null;  // null means the control is valid.
}

// ── Custom validator: passwords match ────────────────────────────────────────
// This validator is applied to the whole FormGroup (not a single control),
// so it receives the group and can compare values across fields.
function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password        = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  signupForm: FormGroup;
  errorMessage = '';     // Server-side error displayed under the form.
  loading = false;       // Disables the button while the HTTP call is in-flight.
  hidePassword = true;   // Toggles the first password field between text/dots.
  hideConfirm  = true;   // Toggles the confirm password field between text/dots.

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // The second argument to fb.group() is group-level options.
    // validators here runs passwordsMatchValidator against the whole group.
    this.signupForm = this.fb.group(
      {
        username:        ['', Validators.required],
        // Array of validators: field must be non-empty AND pass complexity check.
        password:        ['', [Validators.required, passwordComplexityValidator]],
        confirmPassword: ['', Validators.required]
      },
      { validators: passwordsMatchValidator }  // Group-level validator.
    );
  }

  // ── Computed properties used by the template ────────────────────────────────

  // True when the password field has been edited AND fails the complexity rule.
  // We only show the error after the user has typed (dirty) to avoid
  // immediately showing an error on an untouched field.
  get passwordInvalid(): boolean {
    const ctrl = this.signupForm.get('password');
    return !!(ctrl?.dirty && ctrl?.hasError('passwordComplexity'));
  }

  // True when the confirm field has been edited AND the passwords don't match.
  get passwordsMismatch(): boolean {
    const confirmTouched = this.signupForm.get('confirmPassword')?.dirty;
    return !!(confirmTouched && this.signupForm.hasError('passwordsMismatch'));
  }

  // ── Event handlers ──────────────────────────────────────────────────────────

  // Called when the user clicks "Sign Up".
  onSignUp(): void {
    if (this.signupForm.invalid) return;  // Extra safety check.

    this.loading = true;
    this.errorMessage = '';

    // Destructure only the fields the API needs (skip confirmPassword).
    const { username, password } = this.signupForm.value;
    this.authService.register({ username, password }).subscribe({
      next: () => {
        // Registration succeeded — go to login so the user signs in.
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // Show the server's error message, or a fallback if none is provided.
        this.errorMessage = err?.error?.message ?? 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }

  // Called when the user clicks "Back to Login".
  onBackToLogin(): void {
    this.router.navigate(['/login']);
  }
}
