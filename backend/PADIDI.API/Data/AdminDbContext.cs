using Microsoft.EntityFrameworkCore;
using PADIDI.API.Models;

namespace PADIDI.API.Data;

public class AdminDbContext : DbContext
{
    public AdminDbContext(DbContextOptions<AdminDbContext> options) : base(options)
    {
    }

    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<Ad> Ads => Set<Ad>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(AdminDbContext).Assembly,
            type => type.Namespace?.StartsWith("PADIDI.API.Data.AdminDb.Configurations") == true
        );
    }
}
