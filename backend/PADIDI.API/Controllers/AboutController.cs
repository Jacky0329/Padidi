using Microsoft.AspNetCore.Mvc;

namespace PADIDI.API.Controllers;

[ApiController]
[Route("api/about")]
public class AboutController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            companyName = "PADIDI",
            tagline = "Fashion for everyone.",
            description = "PADIDI is a fashion e-commerce platform offering a curated collection of clothing, accessories, and footwear for every style and occasion. Our mission is to make quality fashion accessible to everyone."
        });
    }
}
