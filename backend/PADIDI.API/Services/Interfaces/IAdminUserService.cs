using PADIDI.API.DTOs.AdminUsers;

namespace PADIDI.API.Services.Interfaces;

public interface IAdminUserService
{
    Task<List<AdminUserReadDto>> GetAllAsync();
    Task<AdminUserReadDto> GetByIdAsync(Guid id);
    Task<AdminUserReadDto> CreateAsync(AdminUserCreateDto dto);
    Task<AdminUserReadDto> UpdateAsync(Guid id, AdminUserUpdateDto dto);
    Task DeleteAsync(Guid id);
}
