using Microsoft.EntityFrameworkCore;
using PADIDI.API.Data;
using PADIDI.API.Models;

namespace PADIDI.API.Data;

public static class SeedData
{
    public static async Task SeedDefaultAdminAsync(IServiceProvider serviceProvider, IConfiguration configuration)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AdminDbContext>();

        if (await context.AdminUsers.AnyAsync())
            return;

        var email = configuration["SeedAdmin:Email"] ?? "admin@padidi.com";
        var password = configuration["SeedAdmin:Password"] ?? "Admin@123!";

        var admin = new AdminUser
        {
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12)
        };

        context.AdminUsers.Add(admin);
        await context.SaveChangesAsync();
    }
}
