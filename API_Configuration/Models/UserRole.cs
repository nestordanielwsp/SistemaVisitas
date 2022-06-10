using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_Configuration.Models
{
    [Table("UserRole", Schema = "CONFIG")]
    public class UserRole
    {
        public int UserRoleId { get; set; }
        [Required,ForeignKey("User")]
        public int UserId { get; set; }
        public User? User { get; set; }

        [Required,ForeignKey("Role")]
        public int RoleId { get; set; }
        public Role? Role { get; set; }
        public DateTime CreationDate { get; set; }
        public int CreatedBy { get; set; }
    }
}
