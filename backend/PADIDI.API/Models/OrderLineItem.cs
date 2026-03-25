namespace PADIDI.API.Models;

public class OrderLineItem
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public string ProductNameSnapshot { get; set; } = string.Empty;
    public decimal UnitPriceSnapshot { get; set; }
    public string SizeSnapshot { get; set; } = string.Empty;
    public string ColorSnapshot { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal LineTotal { get; set; }

    public Order Order { get; set; } = null!;
}
