using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockerAPI.Models;

public class Product_Use_LogsConfiguration : IEntityTypeConfiguration<Product_Use_Log>
{
    public void Configure(EntityTypeBuilder<Product_Use_Log> builder)
    {
        builder.Property(u => u.Date).HasDefaultValueSql("GETDATE()");

        builder.HasOne(ug => ug.Group)
            .WithMany()
            .HasForeignKey(ug => ug.Group_Id)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(ug => ug.Product)
            .WithMany()
            .HasForeignKey(ug => ug.Product_Id)
            .OnDelete(DeleteBehavior.Cascade);
    }
}