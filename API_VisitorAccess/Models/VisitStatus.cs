using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_VisitorAccess.Models
{
    [Table("VisitStatus", Schema = "SEC_VM")]
    public class VisitStatus
    {
        [Key]
        public int VisitStatusId { get; set; }

        public string? Description { get; set; }

        public bool? IsEnabled { get; set; }
    }
}
