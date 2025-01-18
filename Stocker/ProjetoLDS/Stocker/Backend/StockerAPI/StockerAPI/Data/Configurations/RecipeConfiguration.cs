using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockerAPI.Models;

public class RecipeConfiguration : IEntityTypeConfiguration<Recipe>
{
    public void Configure(EntityTypeBuilder<Recipe> builder)
    {
        builder.HasOne(ug => ug.Group)
            .WithMany()
            .HasForeignKey(ug => ug.Group_Id)
            .OnDelete(DeleteBehavior.Cascade);
    }
}