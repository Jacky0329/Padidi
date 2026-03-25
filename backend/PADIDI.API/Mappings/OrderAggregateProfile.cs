using AutoMapper;
using PADIDI.API.DTOs.Orders;
using PADIDI.API.Models;

namespace PADIDI.API.Mappings;

public class OrderAggregateProfile : Profile
{
    public OrderAggregateProfile()
    {
        CreateMap<Order, OrderReadDto>();
        CreateMap<OrderLineItem, OrderLineItemReadDto>();
    }
}
