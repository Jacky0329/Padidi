using PADIDI.API.DTOs.Products;

namespace PADIDI.API.Services.Interfaces;

public interface IProductService
{
    Task<List<ProductReadDto>> GetAllAsync(Guid? categoryId);
    Task<ProductReadDto> GetByIdAsync(Guid id);
    Task<ProductReadDto> CreateAsync(ProductCreateDto dto);
    Task<ProductReadDto> UpdateAsync(Guid id, ProductUpdateDto dto);
    Task DeleteAsync(Guid id);
    Task<ProductVariantReadDto> CreateVariantAsync(Guid productId, ProductVariantCreateDto dto);
    Task<ProductVariantReadDto> UpdateVariantAsync(Guid productId, Guid variantId, ProductVariantUpdateDto dto);
    Task DeleteVariantAsync(Guid productId, Guid variantId);
}
