using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PADIDI.API.Data;
using PADIDI.API.DTOs.Auth;
using PADIDI.API.Models;
using PADIDI.API.Services.Interfaces;

namespace PADIDI.API.Services;

public class AdminAuthService : IAdminAuthService
{
    private readonly AdminDbContext _context;
    private readonly IConfiguration _configuration;

    public AdminAuthService(AdminDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AdminUser?> ValidateAdminAsync(string email, string password)
    {
        var admin = await _context.AdminUsers.FirstOrDefaultAsync(a => a.Email == email);
        if (admin is null) return null;

        var isValid = BCrypt.Net.BCrypt.Verify(password, admin.PasswordHash);
        return isValid ? admin : null;
    }

    public AdminLoginResponseDto GenerateJwtToken(AdminUser adminUser)
    {
        var secret = _configuration["Jwt:Secret"] ?? throw new InvalidOperationException("Jwt:Secret not configured");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expiresAt = DateTimeOffset.UtcNow.AddHours(24);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, adminUser.Id.ToString()),
            new Claim(ClaimTypes.Email, adminUser.Email),
            new Claim(ClaimTypes.Role, "Admin")
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expiresAt.UtcDateTime,
            signingCredentials: credentials
        );

        return new AdminLoginResponseDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            ExpiresAt = expiresAt
        };
    }
}
