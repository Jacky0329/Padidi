namespace PADIDI.API.Models;

public class BuyerAccount
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTimeOffset CreatedAt { get; set; }

    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
