using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_VisitorAccess.Models
{
    [Table("VisitRecordDevice", Schema = "SEC_VM")]
    public class VisitRecordDevice
    {
        [Key]
        public int VisitRecordDeviceId { get; set; }
        [ForeignKey("DeviceType")]
        public int? DeviceTypeId { get; set; }
        public DeviceType? DeviceType { get; set; }
        [ForeignKey("VisitRecord")]
        public int? VisitRecordId { get; set; }
        public VisitRecord? VisitRecord { get; set; }
        public string? Brand { get; set; }

        public string? Model { get; set; }

        public string? Antivirus { get; set; }

        public DateTime? LastDateOfAntivirusUpdt { get; set; }

        public string? Comments { get; set; }

        public string? Serial { get; set; }
    }
}
