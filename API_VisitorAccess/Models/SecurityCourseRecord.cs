using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_VisitorAccess.Models
{
    [Table("SecurityCourseRecord", Schema = "SEC_VM")]
    public class SecurityCourseRecord
    {
        [Key]
        public int SecurityCourseRecordId { get; set; }

        public DateTime? RegistryDate { get; set; }

        public DateTime? ExpirationDate { get; set; }
        [ForeignKey("Visitor")]
        public int? VisitorId { get; set; }
        public Visitor? Visitor { get; set; }
        [ForeignKey("SecurityCourse")]
        public int? SecurityCourseId { get; set; }
        public SecurityCourse? SecurityCourse { get; set; }
    }
}
