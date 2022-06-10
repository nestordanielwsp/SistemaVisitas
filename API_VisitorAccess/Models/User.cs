using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_VisitorAccess.Models
{
    [Table("User", Schema = "CONFIG")]
    public class User
    {
        [Key]
        public int UserId { get; set; }

        public string? Area { get; set; }

        public string? EmployeeNumber { get; set; }

        public string? Email { get; set; }

        public string? Name { get; set; }

        public string? LastName { get; set; }

        public bool IsEnabled { get; set; }
    }
}
