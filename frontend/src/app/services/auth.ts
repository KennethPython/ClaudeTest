// ─────────────────────────────────────────────────────────────────────────────
// auth.ts  (AuthService)
// Central service for everything authentication-related.
// Components call methods here instead of making HTTP calls directly — this
// keeps API logic in one place and makes the components easier to read.
//
// The JWT token is stored in localStorage so it survives page refreshes.
// ─────────────────────────────────────────────────────────────────────────────

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.models';

// ── Mock users for frontend testing without a running backend ─────────────────
// Remove this block (and the mock check in login()) once the backend is ready.
const MOCK_USERS: { username: string; password: string }[] = [
  { username: 'Kenneth', password: 'Azerty7.' }
];

// @Injectable({ providedIn: 'root' }) makes Angular create one shared instance
// of this service for the entire app (singleton pattern).
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Base URL of the .NET backend. Change this when deploying to a real server.
  private readonly apiUrl = 'http://localhost:5000/api/auth';

  // Keys used to store data in the browser's localStorage.
  private readonly tokenKey = 'auth_token';
  private readonly usernameKey = 'auth_username';

  // Angular injects HttpClient automatically — we use it to make HTTP calls.
  constructor(private http: HttpClient) {}

  // Sends login credentials to the backend.
  // tap() is an RxJS operator that lets us "peek" at the response and run a
  // side-effect (saving to localStorage) without changing the value.
  login(credentials: LoginRequest): Observable<AuthResponse> {
    // ── Mock login (no backend needed) ───────────────────────────────────────
    // Check if the credentials match any mock user.
    // of() creates an Observable that immediately emits one value and completes,
    // mimicking a successful HTTP response without making a real network call.
    const mockUser = MOCK_USERS.find(
      u => u.username === credentials.username && u.password === credentials.password
    );
    if (mockUser) {
      const mockResponse: AuthResponse = { token: 'mock-jwt-token', username: mockUser.username };
      localStorage.setItem(this.tokenKey, mockResponse.token);
      localStorage.setItem(this.usernameKey, mockResponse.username);
      return of(mockResponse);
    }
    // ─────────────────────────────────────────────────────────────────────────

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Save the token and username so other parts of the app can use them.
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.usernameKey, response.username);
      })
    );
  }

  // Sends registration data to the backend.
  // We do NOT auto-store the token here — after sign-up the user is redirected
  // to the login page to sign in manually.
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }

  // Clears both stored values, effectively logging the user out.
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
  }

  // Returns true if a token exists in localStorage.
  // !! converts the value to a boolean (null → false, a string → true).
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // Returns the raw JWT string, or null if the user is not logged in.
  // Used by the JWT interceptor to attach the token to outgoing HTTP requests.
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Returns the username that was stored after login, or null.
  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }
}
