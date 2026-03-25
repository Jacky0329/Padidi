using AutoMapper;
using PADIDI.API.DTOs.Ads;
using PADIDI.API.Models;

namespace PADIDI.API.Mappings;

public class AdAggregateProfile : Profile
{
    public AdAggregateProfile()
    {
        CreateMap<Ad, AdReadDto>();
    }
}
