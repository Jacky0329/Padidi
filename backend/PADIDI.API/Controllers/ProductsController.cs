using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PADIDI.API.DTOs.Products;
using PADIDI.API.Services.Interfaces;

namespace PADIDI.API.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ProductReadDto>>> GetAll([FromQuery] Guid? categoryId)
    {
        var products = await _productService.GetAllAsync(categoryId);
        return Ok(products);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProductReadDto>> GetById(Guid id)
    {
        var product = await _productService.GetByIdAsync(id);
        return Ok(product);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProductReadDto>> Create([FromBody] ProductCreateDto dto)
    {
        var product = await _productService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProductReadDto>> Update(Guid id, [FromBody] ProductUpdateDto dto)
    {
        var product = await _productService.UpdateAsync(id, dto);
        return Ok(product);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _productService.DeleteAsync(id);
        return NoContent();
    }

    // Variant sub-resource endpoints
    [HttpPost("{productId:guid}/variants")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProductVariantReadDto>> CreateVariant(Guid productId, [FromBody] ProductVariantCreateDto dto)
    {
        var variant = await _productService.CreateVariantAsync(productId, dto);
        return Created($"/api/products/{productId}/variants/{variant.Id}", variant);
    }

    [HttpPut("{productId:guid}/variants/{variantId:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProductVariantReadDto>> UpdateVariant(Guid productId, Guid variantId, [FromBody] ProductVariantUpdateDto dto)
    {
        var variant = await _productService.UpdateVariantAsync(productId, variantId, dto);
        return Ok(variant);
    }

    [HttpDelete("{productId:guid}/variants/{variantId:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteVariant(Guid productId, Guid variantId)
    {
        await _productService.DeleteVariantAsync(productId, variantId);
        return NoContent();
    }
}
