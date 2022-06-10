using System.ComponentModel.DataAnnotations.Schema;

namespace API_Configuration.Models
{
    [Table("Area",Schema="CONFIG")]
    public class Area
    {
        public int AreaId { get; set; }
        public string? Description { get; set; }
        public bool IsEnabled { get; set; }
        public DateTime CreationDate { get; set; }
        public int CreatedBy { get; set; }
    }
}
