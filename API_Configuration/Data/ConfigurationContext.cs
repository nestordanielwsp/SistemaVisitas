using API_Configuration.Models;
using Microsoft.EntityFrameworkCore;

namespace API_Configuration.Data
{
    public class ConfigurationContext : DbContext
    {
        public ConfigurationContext(DbContextOptions<ConfigurationContext> options)
            : base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Area> Areas { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<View> Views { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<RoleView> RoleViews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<View>()
                .HasOne(m => m.Module)
                .WithMany()
                .OnDelete(DeleteBehavior.NoAction);

        }
    }

}
