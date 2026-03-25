using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PADIDI.API.Data;
using PADIDI.API.DTOs.Products;
using PADIDI.API.Models;
using PADIDI.API.Services.Interfaces;

namespace PADIDI.API.Services;

public class ProductService : IProductService
{
    private readonly ClientDbContext _context;
    private readonly IMapper _mapper;

    public ProductService(ClientDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<ProductReadDto>> GetAllAsync(Guid? categoryId)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .Include(p => p.Variants)
            .AsQueryable();

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId.Value);

        var products = await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
        return _mapper.Map<List<ProductReadDto>>(products);
    }

    public async Task<ProductReadDto> GetByIdAsync(Guid id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Variants)
            .FirstOrDefaultAsync(p => p.Id == id)
            ?? throw new KeyNotFoundException($"Product with id '{id}' not found.");

        return _mapper.Map<ProductReadDto>(product);
    }

    public async Task<ProductReadDto> CreateAsync(ProductCreateDto dto)
    {
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
        if (!categoryExists)
            throw new KeyNotFoundException($"Category with id '{dto.CategoryId}' not found.");

        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            ImagePath = dto.ImagePath ?? string.Empty,
            Price = dto.Price,
            CategoryId = dto.CategoryId,
            Variants = dto.Variants.Select(v => new ProductVariant
            {
                Size = v.Size,
                Color = v.Color,
                StockQuantity = v.StockQuantity
            }).ToList()
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(product.Id);
    }

    public async Task<ProductReadDto> UpdateAsync(Guid id, ProductUpdateDto dto)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Variants)
            .FirstOrDefaultAsync(p => p.Id == id)
            ?? throw new KeyNotFoundException($"Product with id '{id}' not found.");

        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.CategoryId = dto.CategoryId;
        if (dto.ImagePath is not null)
            product.ImagePath = dto.ImagePath;
        product.UpdatedAt = DateTimeOffset.UtcNow;

        await _context.SaveChangesAsync();
        return _mapper.Map<ProductReadDto>(product);
    }

    public async Task DeleteAsync(Guid id)
    {
        var product = await _context.Products.FindAsync(id)
            ?? throw new KeyNotFoundException($"Product with id '{id}' not found.");

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
    }

    public async Task<ProductVariantReadDto> CreateVariantAsync(Guid productId, ProductVariantCreateDto dto)
    {
        var product = await _context.Products.FindAsync(productId)
            ?? throw new KeyNotFoundException($"Product with id '{productId}' not found.");

        var exists = await _context.ProductVariants
            .AnyAsync(v => v.ProductId == productId && v.Size == dto.Size && v.Color == dto.Color);
        if (exists)
            throw new ArgumentException($"Variant with Size '{dto.Size}' and Color '{dto.Color}' already exists.");

        var variant = new ProductVariant
        {
            ProductId = productId,
            Size = dto.Size,
            Color = dto.Color,
            StockQuantity = dto.StockQuantity
        };

        _context.ProductVariants.Add(variant);
        await _context.SaveChangesAsync();
        return _mapper.Map<ProductVariantReadDto>(variant);
    }

    public async Task<ProductVariantReadDto> UpdateVariantAsync(Guid productId, Guid variantId, ProductVariantUpdateDto dto)
    {
        var variant = await _context.ProductVariants
            .FirstOrDefaultAsync(v => v.Id == variantId && v.ProductId == productId)
            ?? throw new KeyNotFoundException($"Variant not found.");

        variant.Size = dto.Size;
        variant.Color = dto.Color;
        variant.StockQuantity = dto.StockQuantity;
        variant.UpdatedAt = DateTimeOffset.UtcNow;

        await _context.SaveChangesAsync();
        return _mapper.Map<ProductVariantReadDto>(variant);
    }

    public async Task DeleteVariantAsync(Guid productId, Guid variantId)
    {
        var variant = await _context.ProductVariants
            .FirstOrDefaultAsync(v => v.Id == variantId && v.ProductId == productId)
            ?? throw new KeyNotFoundException($"Variant not found.");

        _context.ProductVariants.Remove(variant);
        await _context.SaveChangesAsync();
    }
}
