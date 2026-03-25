using PADIDI.API.DTOs.Orders;

namespace PADIDI.API.Services.Interfaces;

public interface IOrderService
{
    Task<OrderReadDto> CreateOrderAsync(CheckoutRequestDto request);
    Task<List<OrderReadDto>> GetAllAsync();
    Task<OrderReadDto> GetByIdAsync(Guid id);
}
