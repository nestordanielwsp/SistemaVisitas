using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_VisitorAccess.Models
{
    [Table("Company", Schema = "SEC_VM")]
    public class Company
    {
        [Key]
        public int CompanyId { get; set; }

        public string? Description { get; set; }

        public bool? IsEnabled { get; set; }
    }
}
