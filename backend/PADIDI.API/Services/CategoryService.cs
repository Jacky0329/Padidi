using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PADIDI.API.Data;
using PADIDI.API.DTOs.Categories;
using PADIDI.API.Models;
using PADIDI.API.Services.Interfaces;

namespace PADIDI.API.Services;

public class CategoryService : ICategoryService
{
    private readonly ClientDbContext _context;
    private readonly IMapper _mapper;

    public CategoryService(ClientDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<CategoryReadDto>> GetAllAsync()
    {
        var categories = await _context.Categories
            .OrderBy(c => c.Name)
            .ToListAsync();
        return _mapper.Map<List<CategoryReadDto>>(categories);
    }

    public async Task<CategoryReadDto> CreateAsync(CategoryCreateDto dto)
    {
        var exists = await _context.Categories.AnyAsync(c => c.Name == dto.Name);
        if (exists)
            throw new InvalidOperationException($"Category '{dto.Name}' already exists.");

        var category = new Category { Name = dto.Name };
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return _mapper.Map<CategoryReadDto>(category);
    }

    public async Task<CategoryReadDto> UpdateAsync(Guid id, CategoryUpdateDto dto)
    {
        var category = await _context.Categories.FindAsync(id)
            ?? throw new KeyNotFoundException($"Category with id '{id}' not found.");

        category.Name = dto.Name;
        await _context.SaveChangesAsync();
        return _mapper.Map<CategoryReadDto>(category);
    }

    public async Task DeleteAsync(Guid id)
    {
        var category = await _context.Categories
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id)
            ?? throw new KeyNotFoundException($"Category with id '{id}' not found.");

        if (category.Products.Count > 0)
            throw new InvalidOperationException("Cannot delete category with assigned products.");

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
    }
}
