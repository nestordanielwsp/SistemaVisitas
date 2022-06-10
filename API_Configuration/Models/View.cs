using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_Configuration.Models
{
    [Table("View", Schema = "CONFIG")]
    public class View
    {
        public int ViewId { get; set; }
        [Required, ForeignKey("Module")]
        public int ModuleId { get; set; }
        public Module? Module { get; set; }
        public string? Description { get; set; }
        public string? Path { get; set; }
        public bool IsEnabled { get; set; }
        public bool IsHome { get; set; }
        public DateTime CreationDate { get; set; }
        public int CreatedBy { get; set; }
    }
}
