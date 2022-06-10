using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace API_Configuration.Dtos
{
    public class UserCreateDto
    {
        [Required]
        public int AreaId { get; set; }
        [Required]
        public string? EmployeeNumber { get; set; }
        [Required]
        public string? Email { get; set; }
        [Required]
        public string? Name { get; set; }
        [Required]
        public string? LastName { get; set; }

        public IFormFile? ImageFile { get; set; }

        public string? Password { get; set; }
        [Required]
        public bool IsLDAPAuth { get; set; }
        [Required]
        public bool IsEnabled { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;

    }
}
