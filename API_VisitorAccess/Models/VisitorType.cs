using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_VisitorAccess.Models
{
    [Table("VisitorType", Schema = "SEC_VM")]
    public class VisitorType
    {
        [Key]
        public int VisitorTypeId { get; set; }

        public string? Description { get; set; }

        public bool? IsEnabled { get; set; }
    }
}
