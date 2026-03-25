using AutoMapper;
using PADIDI.API.DTOs.Categories;
using PADIDI.API.DTOs.Products;
using PADIDI.API.Models;

namespace PADIDI.API.Mappings;

public class ProductAggregateProfile : Profile
{
    public ProductAggregateProfile()
    {
        CreateMap<Category, CategoryReadDto>();
        CreateMap<Product, ProductReadDto>();
        CreateMap<ProductVariant, ProductVariantReadDto>();

        CreateMap<ProductCreateDto, Product>()
            .ForMember(d => d.Id, opt => opt.Ignore())
            .ForMember(d => d.Category, opt => opt.Ignore())
            .ForMember(d => d.Variants, opt => opt.Ignore());

        CreateMap<ProductVariantCreateDto, ProductVariant>()
            .ForMember(d => d.Id, opt => opt.Ignore())
            .ForMember(d => d.Product, opt => opt.Ignore());
    }
}
