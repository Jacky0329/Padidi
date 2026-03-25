namespace PADIDI.API.Models;

public class Ad
{
    public Guid Id { get; set; }
    public string ImagePath { get; set; } = string.Empty;
    public string RedirectUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}
