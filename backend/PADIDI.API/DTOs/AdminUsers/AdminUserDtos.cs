namespace PADIDI.API.DTOs.AdminUsers;

public class AdminUserReadDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
}

public class AdminUserCreateDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class AdminUserUpdateDto
{
    public string Email { get; set; } = string.Empty;
    public string? Password { get; set; }
}
