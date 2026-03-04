// ─────────────────────────────────────────────────────────────────────────────
// AuthController.cs
// Exposes the authentication REST endpoints that the Angular app calls.
// The controller itself stays thin — it only validates input and delegates
// all real logic to IAuthService.
// ─────────────────────────────────────────────────────────────────────────────

using AuthApi.Models;
using AuthApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuthApi.Controllers
{
    // [ApiController] enables automatic model validation, binding, and 400 responses.
    // [Route("api/auth")] sets the base URL for all actions in this controller.
    [ApiController]
    [Route("api/auth")]
    //Use ControllerBase as it returns Json. Controller returns HTML views
    public class AuthController : ControllerBase
    {
        // Injected via constructor — we depend on the interface, not the concrete class.
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // ── POST /api/auth/login ───────────────────────────────────────────────
        // [HttpPost("login")] means this action handles POST requests to /api/auth/login.
        // [FromBody] tells the framework to deserialize the JSON request body into LoginRequest.
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // ModelState.IsValid checks [Required] / [MinLength] annotations on the DTO.
            // [ApiController] usually handles this automatically, but we keep it explicit.
            if (!ModelState.IsValid)
                return BadRequest(ModelState);  // 400 — returns validation errors as JSON.

            var response = _authService.Login(request);

            if (response == null)
                return Unauthorized(new { message = "Invalid username or password." });  // 401

            return Ok(response);  // 200 — returns { token, username } as JSON.
        }

        // ── POST /api/auth/register ────────────────────────────────────────────
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);  // 400

            var response = _authService.Register(request);

            if (response == null)
                return Conflict(new { message = "Username already exists." });  // 409

            return Ok(response);  // 200 — returns { token, username } as JSON.
        }
    }
}
