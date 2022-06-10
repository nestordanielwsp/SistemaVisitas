using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_Configuration.Migrations
{
    public partial class CONFIG_SecondMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Salt",
                schema: "CONFIG",
                table: "User");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Salt",
                schema: "CONFIG",
                table: "User",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
