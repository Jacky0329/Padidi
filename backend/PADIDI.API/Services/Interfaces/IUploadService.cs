namespace PADIDI.API.Services.Interfaces;

public interface IUploadService
{
    Task<string> SaveImageAsync(IFormFile file);
}
