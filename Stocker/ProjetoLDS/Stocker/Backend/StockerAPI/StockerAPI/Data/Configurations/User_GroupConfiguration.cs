using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockerAPI.Models;

public class User_GroupConfiguration : IEntityTypeConfiguration<User_Group>
{
    public void Configure(EntityTypeBuilder<User_Group> builder)
    {
        builder.HasKey(ug => new { ug.User_Id, ug.Group_Id });

        builder.HasOne(ug => ug.User)
            .WithMany()
            .HasForeignKey(ug => ug.User_Id)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ug => ug.Group)
            .WithMany()
            .HasForeignKey(ug => ug.Group_Id)
            .OnDelete(DeleteBehavior.Cascade);
    }
}