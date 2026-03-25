using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PADIDI.API.Models;

namespace PADIDI.API.Data.ClientDb.Configurations;

public class BuyerAccountConfiguration : IEntityTypeConfiguration<BuyerAccount>
{
    public void Configure(EntityTypeBuilder<BuyerAccount> builder)
    {
        builder.ToTable("buyer_accounts");
        builder.HasKey(b => b.Id);
        builder.Property(b => b.Id).HasDefaultValueSql("gen_random_uuid()");
        builder.Property(b => b.Email).HasMaxLength(255).IsRequired();
        builder.HasIndex(b => b.Email).IsUnique();
        builder.Property(b => b.PasswordHash).HasMaxLength(255).IsRequired();
        builder.Property(b => b.FirstName).HasMaxLength(100);
        builder.Property(b => b.LastName).HasMaxLength(100);
        builder.Property(b => b.CreatedAt).HasDefaultValueSql("now()");

        builder.HasMany(b => b.Orders)
            .WithOne()
            .HasForeignKey(o => o.BuyerAccountId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
