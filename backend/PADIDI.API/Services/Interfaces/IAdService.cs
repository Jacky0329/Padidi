using PADIDI.API.DTOs.Ads;

namespace PADIDI.API.Services.Interfaces;

public interface IAdService
{
    Task<List<AdReadDto>> GetActiveAsync();
    Task<List<AdReadDto>> GetAllAsync();
    Task<AdReadDto> CreateAsync(AdCreateDto dto, string imagePath);
    Task<AdReadDto> UpdateAsync(Guid id, AdUpdateDto dto);
    Task DeleteAsync(Guid id);
}
