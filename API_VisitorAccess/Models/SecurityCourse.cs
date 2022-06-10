using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_VisitorAccess.Models
{
    [Table("SecurityCourse", Schema = "SEC_VM")]
    public class SecurityCourse
    {
        [Key]
        public int SecurityCourseId { get; set; }

        public string? Description { get; set; }
        public string? FileName { get; set; }

        public DateTime? RegistryDate { get; set; }

        public bool? IsEnabled { get; set; }
    }
}
