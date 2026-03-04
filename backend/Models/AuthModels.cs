// ─────────────────────────────────────────────────────────────────────────────
// AuthModels.cs
// Plain C# classes (DTOs — Data Transfer Objects) that represent the JSON
// bodies sent in HTTP requests and responses. Keeping them separate from the
// internal User model means the API contract is independent of the database model.
// ─────────────────────────────────────────────────────────────────────────────

using System.ComponentModel.DataAnnotations;

namespace AuthApi.Models
{
    // Body expected by POST /api/auth/login
    public class LoginRequest
    {
        [Required]  // Returns 400 Bad Request automatically if this field is missing.
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }

    // Body expected by POST /api/auth/register
    public class RegisterRequest
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [MinLength(8)]  // Returns 400 if the password is shorter than 8 characters.
        public string Password { get; set; }
    }

    // JSON returned to the client after a successful login or register.
    public class AuthResponse
    {
        public string Token { get; set; }     // The JWT the client must store and reuse.
        public string Username { get; set; }  // Convenient for the UI to display the name.
    }
}
