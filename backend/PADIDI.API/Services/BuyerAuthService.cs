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

public class BuyerAuthService : IBuyerAuthService
{
    private readonly ClientDbContext _db;
    private readonly IConfiguration _config;

    public BuyerAuthService(ClientDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<BuyerProfileDto> RegisterAsync(BuyerRegisterRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6)
            throw new ArgumentException("Password must be at least 6 characters.");

        var exists = await _db.BuyerAccounts.AnyAsync(b => b.Email == request.Email);
        if (exists)
            throw new InvalidOperationException("Email already registered.");

        var buyer = new BuyerAccount
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12),
            FirstName = request.FirstName,
            LastName = request.LastName,
            CreatedAt = DateTimeOffset.UtcNow
        };

        _db.BuyerAccounts.Add(buyer);
        await _db.SaveChangesAsync();

        return new BuyerProfileDto
        {
            Id = buyer.Id,
            Email = buyer.Email,
            FirstName = buyer.FirstName,
            LastName = buyer.LastName
        };
    }

    public async Task<BuyerLoginResponseDto> LoginAsync(BuyerLoginRequestDto request)
    {
        var buyer = await _db.BuyerAccounts.FirstOrDefaultAsync(b => b.Email == request.Email);
        if (buyer == null || !BCrypt.Net.BCrypt.Verify(request.Password, buyer.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        var token = GenerateJwtToken(buyer);
        var expiry = DateTime.UtcNow.AddHours(24);

        return new BuyerLoginResponseDto
        {
            Token = token,
            ExpiresAt = expiry.ToString("o"),
            Buyer = new BuyerProfileDto
            {
                Id = buyer.Id,
                Email = buyer.Email,
                FirstName = buyer.FirstName,
                LastName = buyer.LastName
            }
        };
    }

    public async Task<BuyerProfileDto> GetAccountAsync(Guid buyerId)
    {
        var buyer = await _db.BuyerAccounts.FindAsync(buyerId);
        if (buyer == null) throw new KeyNotFoundException("Buyer not found.");

        return new BuyerProfileDto
        {
            Id = buyer.Id,
            Email = buyer.Email,
            FirstName = buyer.FirstName,
            LastName = buyer.LastName
        };
    }

    private string GenerateJwtToken(BuyerAccount buyer)
    {
        //Get your secret key
        //from appsettings.json or environment variable
        var secret = _config["Jwt:Secret"]!;
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        //Create signing credentials
        //Use this secret key + SHA256 to sign the token
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        //Claims = data stored inside the token
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, buyer.Id.ToString()),
            new Claim(ClaimTypes.Email, buyer.Email),
            new Claim(ClaimTypes.Role, "Buyer")
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: creds
        );
        //convert token object to string
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
