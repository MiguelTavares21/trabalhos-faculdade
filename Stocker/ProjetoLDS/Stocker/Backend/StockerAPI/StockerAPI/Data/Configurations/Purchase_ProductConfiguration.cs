using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockerAPI.Models;

public class Purchase_ProductConfiguration : IEntityTypeConfiguration<Purchased_Product>
{
    public void Configure(EntityTypeBuilder<Purchased_Product> builder)
    {
        builder.HasKey(ug => new { ug.Product_Id, ug.Purchase_Id });

        builder.HasOne(ug => ug.Purchase)
            .WithMany()
            .HasForeignKey(ug => ug.Purchase_Id)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ug => ug.Product)
            .WithMany()
            .HasForeignKey(ug => ug.Product_Id)
            .OnDelete(DeleteBehavior.Restrict);
    }
}