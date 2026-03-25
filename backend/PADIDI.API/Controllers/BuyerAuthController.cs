using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PADIDI.API.DTOs.Auth;
using PADIDI.API.Services.Interfaces;

namespace PADIDI.API.Controllers;

[ApiController]
[Route("api/buyer/auth")]
public class BuyerAuthController : ControllerBase
{
    private readonly IBuyerAuthService _buyerAuthService;

    public BuyerAuthController(IBuyerAuthService buyerAuthService)
    {
        _buyerAuthService = buyerAuthService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] BuyerRegisterRequestDto request)
    {
        var profile = await _buyerAuthService.RegisterAsync(request);
        return StatusCode(201, profile);
    }

    [HttpPost("login")]
    public async Task<ActionResult<BuyerLoginResponseDto>> Login([FromBody] BuyerLoginRequestDto request)
    {
        var response = await _buyerAuthService.LoginAsync(request);
        return Ok(response);
    }

    [HttpGet("/api/buyer/account")]
    [Authorize(Roles = "Buyer")]
    public async Task<ActionResult<BuyerProfileDto>> GetAccount()
    {
        var buyerIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (buyerIdClaim == null || !Guid.TryParse(buyerIdClaim, out var buyerId))
            return Unauthorized();

        var profile = await _buyerAuthService.GetAccountAsync(buyerId);
        return Ok(profile);
    }
}
