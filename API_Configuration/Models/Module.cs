using System.ComponentModel.DataAnnotations.Schema;

namespace API_Configuration.Models
{
    [Table("Module", Schema = "CONFIG")]
    public class Module
    {
        public int ModuleId { get; set; }
        public string? Description { get; set; }
        public bool IsEnabled { get; set; }
        public DateTime CreationDate { get; set; }
        public int CreatedBy { get; set; }

    }
}
