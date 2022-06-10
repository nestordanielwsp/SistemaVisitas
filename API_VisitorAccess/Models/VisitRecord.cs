using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_VisitorAccess.Models
{
    [Table("VisitRecord", Schema = "SEC_VM")]
    public record VisitRecord
    {
        [Key]
        public int VisitRecordId { get; set; }

        public string? Folio { get; set; }
        [ForeignKey("ContactEmployee")]
        public int? Contact { get; set; }
        public User? ContactEmployee { get; set; }
        public DateTime? RegistrationDate { get; set; }

        public DateTime? VisitDate { get; set; }

        public DateTime? EntryDate { get; set; }

        public DateTime? DepartureDate { get; set; }
        [ForeignKey("VisitStatus")]
        public int? VisitStatusId { get; set; }
        public VisitStatus? VisitStatus { get; set; }
        [ForeignKey("Visitor")]
        public int? VisitorId { get; set; }
        public Visitor? Visitor { get; set; }
        [ForeignKey("SecurityBadge")]
        public int? SecurityBadgeId { get; set; }
        public SecurityBadge? SecurityBadge { get; set; }
        [ForeignKey("Document")]
        public int? DocumentId { get; set; }
        public Document? Document { get; set; }
        [ForeignKey("ITReviewerEmployee")]
        public int? ITReviewer { get; set; }
        public User? ITReviewerEmployee { get; set; }
        public List<VisitRecordDevice> Devices { get; set; } = new List<VisitRecordDevice>();
    }
}
