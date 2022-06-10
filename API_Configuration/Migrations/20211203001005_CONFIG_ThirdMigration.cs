using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_Configuration.Migrations
{
    public partial class CONFIG_ThirdMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsHome",
                schema: "CONFIG",
                table: "View",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsHome",
                schema: "CONFIG",
                table: "View");
        }
    }
}
