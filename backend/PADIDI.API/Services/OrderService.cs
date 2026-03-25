using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PADIDI.API.Data;
using PADIDI.API.DTOs.Orders;
using PADIDI.API.Models;
using PADIDI.API.Services.Interfaces;

namespace PADIDI.API.Services;

public class OrderService : IOrderService
{
    private readonly ClientDbContext _db;
    private readonly IMapper _mapper;

    public OrderService(ClientDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public async Task<OrderReadDto> CreateOrderAsync(CheckoutRequestDto request)
    {
        if (request.CartItems.Count == 0)
            throw new ArgumentException("Cart is empty.");

        var variantIds = request.CartItems.Select(ci => ci.VariantId).ToList();

        // Load variants with their products for price sourcing (SECURITY: price from DB only)
        var variants = await _db.ProductVariants
            .Include(v => v.Product)
            .Where(v => variantIds.Contains(v.Id))
            .ToListAsync();

        if (variants.Count != variantIds.Count)
            throw new KeyNotFoundException("One or more variants not found.");

        // Check stock availability
        var insufficientVariants = new List<object>();
        foreach (var cartItem in request.CartItems)
        {
            var variant = variants.First(v => v.Id == cartItem.VariantId);
            if (variant.StockQuantity < cartItem.Quantity)
            {
                insufficientVariants.Add(new
                {
                    variantId = variant.Id,
                    productName = variant.Product.Name,
                    size = variant.Size,
                    color = variant.Color
                });
            }
        }

        if (insufficientVariants.Count > 0)
            throw new InvalidOperationException(
                System.Text.Json.JsonSerializer.Serialize(new
                {
                    error = "INSUFFICIENT_STOCK",
                    insufficientVariants
                }));

        // Create order within transaction
        await using var transaction = await _db.Database.BeginTransactionAsync();

        var order = new Order
        {
            Id = Guid.NewGuid(),
            BuyerNameSnapshot = request.BuyerName,
            BuyerEmailSnapshot = request.BuyerEmail,
            PlacedAt = DateTimeOffset.UtcNow
        };

        decimal orderTotal = 0;

        foreach (var cartItem in request.CartItems)
        {
            var variant = variants.First(v => v.Id == cartItem.VariantId);
            // SECURITY: Use price from the database, NOT from the client request
            var unitPrice = variant.Product.Price;
            var lineTotal = unitPrice * cartItem.Quantity;

            order.LineItems.Add(new OrderLineItem
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                ProductNameSnapshot = variant.Product.Name,
                UnitPriceSnapshot = unitPrice,
                SizeSnapshot = variant.Size,
                ColorSnapshot = variant.Color,
                Quantity = cartItem.Quantity,
                LineTotal = lineTotal
            });

            // Decrement stock
            variant.StockQuantity -= cartItem.Quantity;
            orderTotal += lineTotal;
        }

        order.OrderTotal = orderTotal;

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();
        await transaction.CommitAsync();

        return _mapper.Map<OrderReadDto>(order);
    }

    public async Task<List<OrderReadDto>> GetAllAsync()
    {
        var orders = await _db.Orders
            .Include(o => o.LineItems)
            .OrderByDescending(o => o.PlacedAt)
            .ToListAsync();

        return _mapper.Map<List<OrderReadDto>>(orders);
    }

    public async Task<OrderReadDto> GetByIdAsync(Guid id)
    {
        var order = await _db.Orders
            .Include(o => o.LineItems)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            throw new KeyNotFoundException("Order not found.");

        return _mapper.Map<OrderReadDto>(order);
    }
}
