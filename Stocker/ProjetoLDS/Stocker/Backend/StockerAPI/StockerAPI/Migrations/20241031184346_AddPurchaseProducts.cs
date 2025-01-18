using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockerAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddPurchaseProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Purchased_Product_Products_Product_Id",
                table: "Purchased_Product");

            migrationBuilder.DropForeignKey(
                name: "FK_Purchased_Product_Purchases_Purchase_Id",
                table: "Purchased_Product");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Purchased_Product",
                table: "Purchased_Product");

            migrationBuilder.RenameTable(
                name: "Purchased_Product",
                newName: "Purchased_Products");

            migrationBuilder.RenameIndex(
                name: "IX_Purchased_Product_Purchase_Id",
                table: "Purchased_Products",
                newName: "IX_Purchased_Products_Purchase_Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Purchased_Products",
                table: "Purchased_Products",
                columns: new[] { "Product_Id", "Purchase_Id" });

            migrationBuilder.AddForeignKey(
                name: "FK_Purchased_Products_Products_Product_Id",
                table: "Purchased_Products",
                column: "Product_Id",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Purchased_Products_Purchases_Purchase_Id",
                table: "Purchased_Products",
                column: "Purchase_Id",
                principalTable: "Purchases",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Purchased_Products_Products_Product_Id",
                table: "Purchased_Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Purchased_Products_Purchases_Purchase_Id",
                table: "Purchased_Products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Purchased_Products",
                table: "Purchased_Products");

            migrationBuilder.RenameTable(
                name: "Purchased_Products",
                newName: "Purchased_Product");

            migrationBuilder.RenameIndex(
                name: "IX_Purchased_Products_Purchase_Id",
                table: "Purchased_Product",
                newName: "IX_Purchased_Product_Purchase_Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Purchased_Product",
                table: "Purchased_Product",
                columns: new[] { "Product_Id", "Purchase_Id" });

            migrationBuilder.AddForeignKey(
                name: "FK_Purchased_Product_Products_Product_Id",
                table: "Purchased_Product",
                column: "Product_Id",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Purchased_Product_Purchases_Purchase_Id",
                table: "Purchased_Product",
                column: "Purchase_Id",
                principalTable: "Purchases",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
