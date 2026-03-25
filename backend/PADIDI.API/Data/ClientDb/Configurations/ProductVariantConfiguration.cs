using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PADIDI.API.Models;

namespace PADIDI.API.Data.ClientDb.Configurations;

public class ProductVariantConfiguration : IEntityTypeConfiguration<ProductVariant>
{
    public void Configure(EntityTypeBuilder<ProductVariant> builder)
    {
        builder.ToTable("product_variants");
        builder.HasKey(v => v.Id);
        builder.Property(v => v.Size).IsRequired().HasMaxLength(20);
        builder.Property(v => v.Color).IsRequired().HasMaxLength(50);
        builder.Property(v => v.StockQuantity).IsRequired();

        builder.HasIndex(v => new { v.ProductId, v.Size, v.Color }).IsUnique();

        builder.HasOne(v => v.Product)
            .WithMany(p => p.Variants)
            .HasForeignKey(v => v.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.ToTable(t => t.HasCheckConstraint("CK_product_variants_StockQuantity", "\"StockQuantity\" >= 0"));
    }
}
