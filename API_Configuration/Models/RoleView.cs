using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_Configuration.Models
{
    [Table("RoleView", Schema = "CONFIG")]
    public class RoleView
    {
        public int RoleViewId { get; set; }
        [Required,ForeignKey("View")]
        public int ViewId { get; set; }
        public View? View { get; set; }
        [Required,ForeignKey("Role")]
        public int RoleId { get; set; }
        public Role? Role { get; set; }
        public DateTime CreationDate { get; set; }
        public int CreatedBy { get; set; }

    }
}
