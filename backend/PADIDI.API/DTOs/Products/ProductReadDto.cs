using PADIDI.API.DTOs.Categories;

namespace PADIDI.API.DTOs.Products;

public class ProductReadDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImagePath { get; set; } = string.Empty;
    public List<string> ImagePaths { get; set; } = new();
    public decimal Price { get; set; }
    public CategoryReadDto Category { get; set; } = null!;
    public List<ProductVariantReadDto> Variants { get; set; } = new();
}
