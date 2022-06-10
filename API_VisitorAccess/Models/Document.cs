using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_VisitorAccess.Models
{
    [Table("Document", Schema = "SEC_VM")]
    public class Document
    {
        [Key]
        public int DocumentId { get; set; }

        public string? Description { get; set; }

        public bool? IsEnabled { get; set; }
    }
}
