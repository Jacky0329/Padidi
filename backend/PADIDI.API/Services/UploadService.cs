using PADIDI.API.Services.Interfaces;

namespace PADIDI.API.Services;

public class UploadService : IUploadService
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp"
    };

    private readonly string _uploadsPath;

    public UploadService(IWebHostEnvironment env)
    {
        _uploadsPath = Path.GetFullPath(Path.Combine(env.ContentRootPath, "..", "..", "uploads"));
        Directory.CreateDirectory(_uploadsPath);
    }

    public async Task<string> SaveImageAsync(IFormFile file)
    {
        var extension = Path.GetExtension(file.FileName);
        if (!AllowedExtensions.Contains(extension))
            throw new ArgumentException("Invalid file type. Only jpg, png, and webp are allowed.");

        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(_uploadsPath, fileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        return $"/uploads/{fileName}";
    }
}
