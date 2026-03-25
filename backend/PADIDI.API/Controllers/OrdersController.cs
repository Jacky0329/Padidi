using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PADIDI.API.DTOs.Orders;
using PADIDI.API.Services.Interfaces;

namespace PADIDI.API.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public async Task<IActionResult> Checkout([FromBody] CheckoutRequestDto request)
    {
        var order = await _orderService.CreateOrderAsync(request);
        return StatusCode(201, new
        {
            message = "Payment feature is not available.",
            order
        });
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<OrderReadDto>>> GetAll()
    {
        var orders = await _orderService.GetAllAsync();
        return Ok(orders);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<OrderReadDto>> GetById(Guid id)
    {
        var order = await _orderService.GetByIdAsync(id);
        return Ok(order);
    }
}
