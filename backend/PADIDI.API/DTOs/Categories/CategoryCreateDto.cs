using System.ComponentModel.DataAnnotations;

namespace PADIDI.API.DTOs.Categories;

public class CategoryCreateDto
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}
