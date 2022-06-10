using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_VisitorAccess.Models
{
    [Table("DeviceType", Schema = "SEC_VM")]
    public class DeviceType
    {
        [Key]
        public int DeviceTypeId { get; set; }

        public string? Description { get; set; }

        public bool? IsEnabled { get; set; }
    }
}
