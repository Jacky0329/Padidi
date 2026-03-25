namespace PADIDI.API.DTOs.Orders;

public class CartItemDto
{
    public Guid VariantId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public string Size { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public class CheckoutRequestDto
{
    public string BuyerName { get; set; } = string.Empty;
    public string BuyerEmail { get; set; } = string.Empty;
    public List<CartItemDto> CartItems { get; set; } = new();
}
