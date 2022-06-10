using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_VisitorAccess.Models
{
    [Table("Visitor", Schema = "SEC_VM")]
    public class Visitor
    {
        [Key]
        public int VisitorId { get; set; }

        public string? Name { get; set; }

        public string? LastName { get; set; }

        public string? MotherLastName { get; set; }

        public string? PhotoUrl { get; set; }

        public string? Email { get; set; }
        [ForeignKey("Company")]
        public int? CompanyId { get; set; }
        public Company? Company { get; set; }
        [ForeignKey("VisitorType")]
        public int? VisitorTypeId { get; set; }
        public VisitorType? VisitorType { get; set; }
    }
}
