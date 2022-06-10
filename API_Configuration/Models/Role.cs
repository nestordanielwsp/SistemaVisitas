using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_Configuration.Models
{
    [Table("Role", Schema = "CONFIG")]
    public class Role
    {
        public int RoleId { get; set; }
        [Required, ForeignKey("Module")]
        public int ModuleId { get; set; }
        public Module? Module { get; set; }
        public string? Description { get; set; }
        public bool IsEnabled { get; set; }
        public DateTime CreationDate { get; set; }
        public int CreatedBy { get; set; }
        public IEnumerable<RoleView> RoleViews { get; set; } = new List<RoleView>();
    }
}
