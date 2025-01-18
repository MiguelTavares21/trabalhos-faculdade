using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockerAPI.Models;

public class PurchaseConfiguration : IEntityTypeConfiguration<Purchase>
{
    public void Configure(EntityTypeBuilder<Purchase> builder)
    {
        builder.Property(u => u.Date).HasDefaultValueSql("GETDATE()");

        builder.HasOne(ug => ug.Group)
            .WithMany()
            .HasForeignKey(ug => ug.Group_Id)
            .OnDelete(DeleteBehavior.Cascade);
    }
}