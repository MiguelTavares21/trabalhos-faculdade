using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockerAPI.Models;

public class Recipe_ProductConfiguration : IEntityTypeConfiguration<Recipe_Product>
{
    public void Configure(EntityTypeBuilder<Recipe_Product> builder)
    {
        builder.HasKey(ug => new { ug.Product_Id, ug.Recipe_Id });

        builder.HasOne(ug => ug.Product)
            .WithMany()
            .HasForeignKey(ug => ug.Product_Id)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ug => ug.Recipe)
            .WithMany()
            .HasForeignKey(ug => ug.Recipe_Id)
            .OnDelete(DeleteBehavior.Cascade);
    }
}