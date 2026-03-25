namespace PADIDI.API.DTOs.Products;

public class ProductVariantReadDto
{
    public Guid Id { get; set; }
    public string Size { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
}
