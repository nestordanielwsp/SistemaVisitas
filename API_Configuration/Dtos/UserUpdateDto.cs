using Microsoft.AspNetCore.Http;

namespace API_Configuration.Dtos
{
    public class UserUpdateDto
    {
        public int UserId { get; set; }
        public int AreaId { get; set; }
        public string? EmployeeNumber { get; set; }
        public string? Name { get; set; }
        public string? LastName { get; set; }
        public IFormFile? ImageFile { get; set; }
        public bool IsLDAPAuth { get; set; }
        public bool IsEnabled { get; set; }
    }
}
