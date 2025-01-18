using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockerAPI.Migrations
{
    /// <inheritdoc />
    public partial class addGroupIdReferenceToProductUseLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Group_Id",
                table: "Product_Use_Log",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Product_Use_Log_Group_Id",
                table: "Product_Use_Log",
                column: "Group_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_Use_Log_Groups_Group_Id",
                table: "Product_Use_Log",
                column: "Group_Id",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_Use_Log_Groups_Group_Id",
                table: "Product_Use_Log");

            migrationBuilder.DropIndex(
                name: "IX_Product_Use_Log_Group_Id",
                table: "Product_Use_Log");

            migrationBuilder.DropColumn(
                name: "Group_Id",
                table: "Product_Use_Log");
        }
    }
}
