using PADIDI.API.DTOs.Auth;

namespace PADIDI.API.Services.Interfaces;

public interface IBuyerAuthService
{
    Task<BuyerProfileDto> RegisterAsync(BuyerRegisterRequestDto request);
    Task<BuyerLoginResponseDto> LoginAsync(BuyerLoginRequestDto request);
    Task<BuyerProfileDto> GetAccountAsync(Guid buyerId);
}
