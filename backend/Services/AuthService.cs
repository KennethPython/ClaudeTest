// ─────────────────────────────────────────────────────────────────────────────
// AuthService.cs
// Implements IAuthService. Handles user storage, password hashing, and JWT
// token generation.
//
// ⚠ The user list is stored in memory (static field). All users are lost when
//   the server restarts. Replace _users with a database call when you add EF Core.
// ─────────────────────────────────────────────────────────────────────────────

using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AuthApi.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace AuthApi.Services
{
    public class AuthService : IAuthService
    {
        // IConfiguration gives us access to appsettings.json values (e.g. Jwt:Key).
        private readonly IConfiguration _configuration;

        // Static = shared across all instances. The list persists for the server's
        // lifetime, but resets on every restart.
        private static readonly List<User> _users = new List<User>();
        private static int _nextId = 1;  // Auto-incrementing ID counter.

        // ASP.NET Core injects IConfiguration automatically via the constructor.
        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // ── Login ─────────────────────────────────────────────────────────────
        public AuthResponse Login(LoginRequest request)
        {
            // Find a user whose name matches (case-insensitive).
            var user = _users.FirstOrDefault(u =>
                u.Username.Equals(request.Username, StringComparison.OrdinalIgnoreCase));

            // Return null (→ 401) if user doesn't exist or password is wrong.
            if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
                return null;

            return new AuthResponse
            {
                Token    = GenerateJwtToken(user),
                Username = user.Username
            };
        }

        // ── Register ──────────────────────────────────────────────────────────
        public AuthResponse Register(RegisterRequest request)
        {
            // Reject the request if the username is already taken.
            bool exists = _users.Any(u =>
                u.Username.Equals(request.Username, StringComparison.OrdinalIgnoreCase));

            if (exists)
                return null;  // Caller will return 409 Conflict.

            var user = new User
            {
                Id           = _nextId++,                        // Assign and advance the counter.
                Username     = request.Username,
                PasswordHash = HashPassword(request.Password)    // Never store plain text.
            };

            _users.Add(user);

            return new AuthResponse
            {
                Token    = GenerateJwtToken(user),
                Username = user.Username
            };
        }

        // ── JWT token generation ──────────────────────────────────────────────
        private string GenerateJwtToken(User user)
        {
            // The signing key is read from appsettings.json → Jwt:Key.
            // SymmetricSecurityKey uses the same secret for signing and verifying.
            var key         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Claims are pieces of data embedded inside the token.
            // The frontend or other APIs can read these without calling the database.
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            };

            var token = new JwtSecurityToken(
                issuer:            _configuration["Jwt:Issuer"],    // Who created the token.
                audience:          _configuration["Jwt:Audience"],  // Who the token is for.
                claims:            claims,
                expires:           DateTime.UtcNow.AddHours(8),     // Token expires after 8 hours.
                signingCredentials: credentials
            );

            // Serialize the token object to the compact JWT string (header.payload.signature).
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // ── Password hashing ──────────────────────────────────────────────────
        // Converts a plain-text password to a SHA-256 hash encoded as Base64.
        // ⚠ SHA-256 without a salt is not production-grade. For real apps use
        //   BCrypt or ASP.NET Core's PasswordHasher which adds salting automatically.
        private static string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);  // Convert raw bytes to a storable string.
            }
        }

        // Hashes the incoming password and compares it to the stored hash.
        private static bool VerifyPassword(string password, string hash)
        {
            return HashPassword(password) == hash;
        }
    }
}
