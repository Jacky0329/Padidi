using System.ComponentModel.DataAnnotations;

namespace PADIDI.API.DTOs.Products;

public class ProductVariantUpdateDto
{
    [Required, MaxLength(20)]
    public string Size { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Color { get; set; } = string.Empty;

    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; }
}
