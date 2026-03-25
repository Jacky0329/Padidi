namespace PADIDI.API.DTOs.Orders;

public class OrderLineItemReadDto
{
    public string ProductNameSnapshot { get; set; } = string.Empty;
    public decimal UnitPriceSnapshot { get; set; }
    public string SizeSnapshot { get; set; } = string.Empty;
    public string ColorSnapshot { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal LineTotal { get; set; }
}

public class OrderReadDto
{
    public Guid Id { get; set; }
    public string BuyerNameSnapshot { get; set; } = string.Empty;
    public string BuyerEmailSnapshot { get; set; } = string.Empty;
    public decimal OrderTotal { get; set; }
    public DateTimeOffset PlacedAt { get; set; }
    public List<OrderLineItemReadDto> LineItems { get; set; } = new();
}
