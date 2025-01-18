using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockerAPI.Models;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.Property(u => u.Quantity)
            .HasDefaultValue(0);

        builder.Property(u => u.In_List)
            .HasDefaultValue(false);

        builder.HasOne(ug => ug.Group)
            .WithMany()
            .HasForeignKey(ug => ug.Group_Id)
            .OnDelete(DeleteBehavior.Cascade);
    }
}