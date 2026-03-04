// ─────────────────────────────────────────────────────────────────────────────
// IAuthService.cs
// Interface (contract) for the authentication service.
//
// Defining an interface and injecting it (instead of the concrete class) lets
// us swap the implementation later — e.g. replace the in-memory store with a
// database — without changing any controller code.
// ─────────────────────────────────────────────────────────────────────────────

using AuthApi.Models;

namespace AuthApi.Services
{
    public interface IAuthService
    {
        // Validates credentials and returns an AuthResponse (with JWT) on success,
        // or null if the username/password is wrong.
        AuthResponse Login(LoginRequest request);

        // Creates a new user and returns an AuthResponse, or null if the
        // username is already taken.
        AuthResponse Register(RegisterRequest request);
    }
}
