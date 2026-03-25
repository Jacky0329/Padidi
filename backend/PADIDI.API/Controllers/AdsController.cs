using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PADIDI.API.DTOs.Ads;
using PADIDI.API.Services.Interfaces;

namespace PADIDI.API.Controllers;

[ApiController]
[Route("api/ads")]
public class AdsController : ControllerBase
{
    private readonly IAdService _adService;
    private readonly IUploadService _uploadService;

    public AdsController(IAdService adService, IUploadService uploadService)
    {
        _adService = adService;
        _uploadService = uploadService;
    }

    [HttpGet("active")]
    public async Task<ActionResult<List<AdReadDto>>> GetActive()
    {
        var ads = await _adService.GetActiveAsync();
        return Ok(ads);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<AdReadDto>>> GetAll()
    {
        var ads = await _adService.GetAllAsync();
        return Ok(ads);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromForm] AdCreateDto dto, IFormFile image)
    {
        var imagePath = await _uploadService.SaveImageAsync(image);
        var ad = await _adService.CreateAsync(dto, imagePath);
        return StatusCode(201, ad);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<AdReadDto>> Update(Guid id, [FromBody] AdUpdateDto dto)
    {
        var ad = await _adService.UpdateAsync(id, dto);
        return Ok(ad);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _adService.DeleteAsync(id);
        return NoContent();
    }
}
