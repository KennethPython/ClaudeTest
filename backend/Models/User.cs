// ─────────────────────────────────────────────────────────────────────────────
// User.cs
// Represents a user record. This is the internal model used by AuthService —
// it is never sent directly to the client (the password hash stays server-side).
// ─────────────────────────────────────────────────────────────────────────────

namespace AuthApi.Models
{
    public class User
    {
        public int Id { get; set; }           // Unique identifier for the user.
        public string Username { get; set; }  // The login name chosen at registration.
        public string PasswordHash { get; set; } // SHA-256 hash — never store plain text.
    }
}
