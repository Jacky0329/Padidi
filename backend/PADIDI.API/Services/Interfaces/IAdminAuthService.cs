using PADIDI.API.DTOs.Auth;
using PADIDI.API.Models;

namespace PADIDI.API.Services.Interfaces;

public interface IAdminAuthService
{
    Task<AdminUser?> ValidateAdminAsync(string email, string password);
    AdminLoginResponseDto GenerateJwtToken(AdminUser adminUser);
}
