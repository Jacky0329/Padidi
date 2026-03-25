namespace PADIDI.API.DTOs.Auth;

public class BuyerRegisterRequestDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}

public class BuyerLoginRequestDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class BuyerProfileDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}

public class BuyerLoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string ExpiresAt { get; set; } = string.Empty;
    public BuyerProfileDto Buyer { get; set; } = null!;
}
