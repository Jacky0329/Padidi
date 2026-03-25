using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PADIDI.API.Models;

namespace PADIDI.API.Data.ClientDb.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("orders");
        builder.HasKey(o => o.Id);
        builder.Property(o => o.Id).HasDefaultValueSql("gen_random_uuid()");
        builder.Property(o => o.BuyerNameSnapshot).HasMaxLength(200).IsRequired();
        builder.Property(o => o.BuyerEmailSnapshot).HasMaxLength(255).IsRequired();
        builder.Property(o => o.OrderTotal).HasColumnType("decimal(18,2)");
        builder.Property(o => o.PlacedAt).HasDefaultValueSql("now()");

        builder.HasMany(o => o.LineItems)
            .WithOne(li => li.Order)
            .HasForeignKey(li => li.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
