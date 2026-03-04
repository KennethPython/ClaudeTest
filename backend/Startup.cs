// ─────────────────────────────────────────────────────────────────────────────
// Startup.cs
// The main configuration file for the ASP.NET Core app.
// ASP.NET Core calls these two methods automatically at startup:
//   ConfigureServices() — register things into the dependency injection (DI) container.
//   Configure()         — build the HTTP request pipeline (middleware order matters here).
// ─────────────────────────────────────────────────────────────────────────────

using System.Text;
using AuthApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace AuthApi
{
    public class Startup
    {
        // Configuration gives access to appsettings.json, environment variables, etc.
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // ── Service registration ───────────────────────────────────────────────
        // Everything added here becomes available for constructor injection.
        public void ConfigureServices(IServiceCollection services)
        {
            // ── CORS ────────────────────────────────────────────────────────────
            // CORS (Cross-Origin Resource Sharing) controls which domains can call
            // this API from a browser. Without this the Angular dev server
            // (localhost:4200) would be blocked by the browser's same-origin policy.
            services.AddCors(options =>
            {
                options.AddPolicy("AngularDev", builder =>
                    builder.WithOrigins("http://localhost:4200")  // Angular dev server URL.
                           .AllowAnyHeader()   // Allow any Content-Type, Authorization, etc.
                           .AllowAnyMethod()); // Allow GET, POST, PUT, DELETE, etc.
            });

            // ── JWT Authentication ───────────────────────────────────────────────
            // Tells ASP.NET Core to validate incoming Bearer tokens using our secret key.
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer           = true,  // Check the 'iss' claim matches Jwt:Issuer.
                        ValidateAudience         = true,  // Check the 'aud' claim matches Jwt:Audience.
                        ValidateLifetime         = true,  // Reject expired tokens.
                        ValidateIssuerSigningKey = true,  // Verify the signature with our secret key.
                        ValidIssuer    = Configuration["Jwt:Issuer"],
                        ValidAudience  = Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
                    };
                });

            // Register AuthService: AddScoped means one instance per HTTP request.
            // We register the interface so controllers receive IAuthService, not AuthService.
            services.AddScoped<IAuthService, AuthService>();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        // ── Middleware pipeline ────────────────────────────────────────────────
        // The order here is important — each app.Use*() wraps the next one.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                // Show a detailed error page during development.
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // Enforce HTTPS Strict Transport Security in production.
                app.UseHsts();
            }

            // Apply the CORS policy before any other middleware so preflight
            // requests (OPTIONS) are handled before authentication runs.
            app.UseCors("AngularDev");

            // Validate the JWT token on every request. Must come before UseMvc().
            app.UseAuthentication();

            // Route requests to controllers.
            app.UseMvc();
        }
    }
}
