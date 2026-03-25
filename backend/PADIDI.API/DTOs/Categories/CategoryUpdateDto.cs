using System.ComponentModel.DataAnnotations;

namespace PADIDI.API.DTOs.Categories;

public class CategoryUpdateDto
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}
