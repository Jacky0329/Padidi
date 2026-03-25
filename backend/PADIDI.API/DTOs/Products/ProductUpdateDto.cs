using System.ComponentModel.DataAnnotations;

namespace PADIDI.API.DTOs.Products;

public class ProductUpdateDto
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }

    [Required]
    public Guid CategoryId { get; set; }

    public string? ImagePath { get; set; }

    public List<string> ImagePaths { get; set; } = new();
}
