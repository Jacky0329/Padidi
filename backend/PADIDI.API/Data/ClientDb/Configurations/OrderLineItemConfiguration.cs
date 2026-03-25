using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PADIDI.API.Models;

namespace PADIDI.API.Data.ClientDb.Configurations;

public class OrderLineItemConfiguration : IEntityTypeConfiguration<OrderLineItem>
{
    public void Configure(EntityTypeBuilder<OrderLineItem> builder)
    {
        builder.ToTable("order_line_items");
        builder.HasKey(li => li.Id);
        builder.Property(li => li.Id).HasDefaultValueSql("gen_random_uuid()");
        builder.Property(li => li.ProductNameSnapshot).HasMaxLength(200).IsRequired();
        builder.Property(li => li.UnitPriceSnapshot).HasColumnType("decimal(18,2)");
        builder.Property(li => li.SizeSnapshot).HasMaxLength(20).IsRequired();
        builder.Property(li => li.ColorSnapshot).HasMaxLength(50).IsRequired();
        builder.Property(li => li.LineTotal).HasColumnType("decimal(18,2)");
        builder.HasCheckConstraint("CK_order_line_items_quantity", "\"Quantity\" >= 1");
    }
}
