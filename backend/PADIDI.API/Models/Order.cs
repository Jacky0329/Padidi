namespace PADIDI.API.Models;

public class Order
{
    public Guid Id { get; set; }
    public Guid? BuyerAccountId { get; set; }
    public string BuyerNameSnapshot { get; set; } = string.Empty;
    public string BuyerEmailSnapshot { get; set; } = string.Empty;
    public decimal OrderTotal { get; set; }
    public DateTimeOffset PlacedAt { get; set; }

    public ICollection<OrderLineItem> LineItems { get; set; } = new List<OrderLineItem>();
}
