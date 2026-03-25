namespace PADIDI.API.DTOs.Auth;

public class AdminLoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public DateTimeOffset ExpiresAt { get; set; }
}
