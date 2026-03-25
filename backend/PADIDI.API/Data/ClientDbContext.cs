using Microsoft.EntityFrameworkCore;
using PADIDI.API.Models;

namespace PADIDI.API.Data;

public class ClientDbContext : DbContext
{
    public ClientDbContext(DbContextOptions<ClientDbContext> options) : base(options)
    {
    }

    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderLineItem> OrderLineItems => Set<OrderLineItem>();
    public DbSet<BuyerAccount> BuyerAccounts => Set<BuyerAccount>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(ClientDbContext).Assembly,
            type => type.Namespace?.StartsWith("PADIDI.API.Data.ClientDb.Configurations") == true
        );
    }
}
