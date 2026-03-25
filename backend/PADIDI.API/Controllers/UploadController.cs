using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PADIDI.API.Services.Interfaces;

namespace PADIDI.API.Controllers;

[ApiController]
[Route("api/uploads")]
public class UploadController : ControllerBase
{
    private readonly IUploadService _uploadService;

    public UploadController(IUploadService uploadService)
    {
        _uploadService = uploadService;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<object>> Upload(IFormFile file)
    {
        var imagePath = await _uploadService.SaveImageAsync(file);
        return Ok(new { imagePath });
    }
}
