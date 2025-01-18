using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockerAPI.Migrations
{
    /// <inheritdoc />
    public partial class addUnityToPurchaseProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Unity",
                table: "Purchased_Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Unity",
                table: "Purchased_Products");
        }
    }
}
