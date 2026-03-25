using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PADIDI.API.Models;

namespace PADIDI.API.Data.AdminDb.Configurations;

public class AdminUserConfiguration : IEntityTypeConfiguration<AdminUser>
{
    public void Configure(EntityTypeBuilder<AdminUser> builder)
    {
        builder.ToTable("admin_users");
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Email).IsRequired().HasMaxLength(255);
        builder.HasIndex(a => a.Email).IsUnique();
        builder.Property(a => a.PasswordHash).IsRequired().HasMaxLength(255);
    }
}
