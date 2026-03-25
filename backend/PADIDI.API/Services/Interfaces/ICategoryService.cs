using PADIDI.API.DTOs.Categories;

namespace PADIDI.API.Services.Interfaces;

public interface ICategoryService
{
    Task<List<CategoryReadDto>> GetAllAsync();
    Task<CategoryReadDto> CreateAsync(CategoryCreateDto dto);
    Task<CategoryReadDto> UpdateAsync(Guid id, CategoryUpdateDto dto);
    Task DeleteAsync(Guid id);
}
