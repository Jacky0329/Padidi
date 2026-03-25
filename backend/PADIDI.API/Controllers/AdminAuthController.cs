using Microsoft.AspNetCore.Mvc;
using PADIDI.API.DTOs.Auth;
using PADIDI.API.Services.Interfaces;

namespace PADIDI.API.Controllers;

[ApiController]
[Route("api/admin/auth")]
public class AdminAuthController : ControllerBase
{
    private readonly IAdminAuthService _authService;

    public AdminAuthController(IAdminAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AdminLoginResponseDto>> Login([FromBody] AdminLoginRequestDto request)
    {
        var admin = await _authService.ValidateAdminAsync(request.Email, request.Password);
        if (admin is null)
            return Unauthorized(new { message = "Invalid credentials." });

        var response = _authService.GenerateJwtToken(admin);
        return Ok(response);
    }
}
