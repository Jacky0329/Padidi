using Microsoft.EntityFrameworkCore;
using PADIDI.API.Data;
using PADIDI.API.DTOs.AdminUsers;
using PADIDI.API.Models;
using PADIDI.API.Services.Interfaces;

namespace PADIDI.API.Services;

public class AdminUserService : IAdminUserService
{
    private readonly AdminDbContext _db;

    public AdminUserService(AdminDbContext db)
    {
        _db = db;
    }

    public async Task<List<AdminUserReadDto>> GetAllAsync()
    {
        return await _db.AdminUsers
            .OrderBy(u => u.Email)
            .Select(u => new AdminUserReadDto { Id = u.Id, Email = u.Email, CreatedAt = u.CreatedAt })
            .ToListAsync();
    }

    public async Task<AdminUserReadDto> GetByIdAsync(Guid id)
    {
        var user = await _db.AdminUsers.FindAsync(id);
        if (user == null) throw new KeyNotFoundException("Admin user not found.");
        return new AdminUserReadDto { Id = user.Id, Email = user.Email, CreatedAt = user.CreatedAt };
    }

    public async Task<AdminUserReadDto> CreateAsync(AdminUserCreateDto dto)
    {
        var exists = await _db.AdminUsers.AnyAsync(u => u.Email == dto.Email);
        if (exists) throw new InvalidOperationException("Email already exists.");

        var user = new AdminUser
        {
            Id = Guid.NewGuid(),
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password, workFactor: 12),
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        _db.AdminUsers.Add(user);
        await _db.SaveChangesAsync();
        return new AdminUserReadDto { Id = user.Id, Email = user.Email, CreatedAt = user.CreatedAt };
    }

    public async Task<AdminUserReadDto> UpdateAsync(Guid id, AdminUserUpdateDto dto)
    {
        var user = await _db.AdminUsers.FindAsync(id);
        if (user == null) throw new KeyNotFoundException("Admin user not found.");

        user.Email = dto.Email;
        if (!string.IsNullOrWhiteSpace(dto.Password))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password, workFactor: 12);
        }
        user.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();

        return new AdminUserReadDto { Id = user.Id, Email = user.Email, CreatedAt = user.CreatedAt };
    }

    public async Task DeleteAsync(Guid id)
    {
        var user = await _db.AdminUsers.FindAsync(id);
        if (user == null) throw new KeyNotFoundException("Admin user not found.");

        _db.AdminUsers.Remove(user);
        await _db.SaveChangesAsync();
    }
}
