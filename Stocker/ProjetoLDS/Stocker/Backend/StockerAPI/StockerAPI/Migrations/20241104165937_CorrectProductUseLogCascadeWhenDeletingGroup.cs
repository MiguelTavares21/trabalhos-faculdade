using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockerAPI.Migrations
{
    /// <inheritdoc />
    public partial class CorrectProductUseLogCascadeWhenDeletingGroup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_Use_Log_Groups_Group_Id",
                table: "Product_Use_Log");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_Use_Log_Groups_Group_Id",
                table: "Product_Use_Log",
                column: "Group_Id",
                principalTable: "Groups",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_Use_Log_Groups_Group_Id",
                table: "Product_Use_Log");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_Use_Log_Groups_Group_Id",
                table: "Product_Use_Log",
                column: "Group_Id",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
