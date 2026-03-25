namespace PADIDI.API.DTOs.Ads;

public class AdCreateDto
{
    public string RedirectUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class AdUpdateDto
{
    public string RedirectUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class AdReadDto
{
    public Guid Id { get; set; }
    public string ImagePath { get; set; } = string.Empty;
    public string RedirectUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}
