using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using API_VisitorAccess.Models;

namespace API_VisitorAccess.Data
{
    public class API_VisitorAccessContext : DbContext
    {
        public API_VisitorAccessContext (DbContextOptions<API_VisitorAccessContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder mb)
        {
            mb.Entity<User>().ToSqlQuery(@"SELECT u.UserId, a.Description as Area, u.EmployeeNumber, u.Email, u.Name, u.LastName, u.IsEnabled 
                                        FROM CONFIG.[User] u INNER JOIN CONFIG.[Area] a ON u.AreaId = a.AreaId");
        }

        public DbSet<API_VisitorAccess.Models.VisitRecord> VisitRecord { get; set; }
        public DbSet<API_VisitorAccess.Models.Visitor> Visitor { get; set; }
        public DbSet<API_VisitorAccess.Models.Company> Company { get; set; }
        public DbSet<API_VisitorAccess.Models.VisitorType> VisitorType { get; set; }
        public DbSet<API_VisitorAccess.Models.SecurityCourseRecord> SecurityCourseRecord { get; set; }
        public DbSet<API_VisitorAccess.Models.VisitRecordDevice> VisitRecordDevice { get; set; }
        public DbSet<API_VisitorAccess.Models.User> User { get; set; }
        public DbSet<API_VisitorAccess.Models.SecurityBadge> SecurityBadge { get; set; }
        public DbSet<API_VisitorAccess.Models.Document> Document { get; set; }
        public DbSet<API_VisitorAccess.Models.DeviceType> DeviceType { get; set; }
        public DbSet<API_VisitorAccess.Models.SecurityCourse> SecurityCourse { get; set; }
    }
}
