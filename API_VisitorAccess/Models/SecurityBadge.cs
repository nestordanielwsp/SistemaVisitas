using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_VisitorAccess.Models
{
    [Table("SecurityBadge", Schema = "SEC_VM")]
    public class SecurityBadge
    {
        [Key]
        public int SecurityBadgeId { get; set; }

        public string? Description { get; set; }

        public bool? IsEnabled { get; set; }
    }
}
