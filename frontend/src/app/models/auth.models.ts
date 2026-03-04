// ─────────────────────────────────────────────────────────────────────────────
// auth.models.ts
// Shared TypeScript interfaces that describe the shape of data sent to and
// received from the backend API. Using interfaces keeps the rest of the code
// type-safe — TypeScript will warn you if you use a wrong field name or type.
// ─────────────────────────────────────────────────────────────────────────────

// Data sent to POST /api/auth/login
export interface LoginRequest {
  username: string;
  password: string;
}

// Data sent to POST /api/auth/register
export interface RegisterRequest {
  username: string;
  password: string;
}

// Data returned by the backend after a successful login or register.
// The token is a JWT string the frontend stores and sends with future requests.
export interface AuthResponse {
  token: string;
  username: string;
}
