using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace API_Configuration.Models
{
    [Table("User", Schema = "CONFIG")]
    public class User
    {
        public int UserId { get; set; }
        [Required,ForeignKey("Area")]
        public int AreaId { get; set; }
        public Area? Area { get; set; }
        public string? EmployeeNumber { get; set; }
        public string? Email { get; set; }
        public string? Name { get; set; }
        public string? LastName { get; set; }
        public string? Image { get; set; }
        public bool IsLDAPAuth { get; set; }
        public bool IsEnabled { get; set; }
        public DateTime CreationDate { get; set; }
        public int CreatedBy { get; set; }
        public IEnumerable<UserRole> UserRoles { get; set; } = new List<UserRole>();

        [JsonIgnore]
        public string? PasswordHash { get; set; }

        [JsonIgnore]
        public List<RefreshToken> RefreshTokens { get; set; }

    }
}
