using System.ComponentModel.DataAnnotations;

namespace API_Configuration.Models
{
    public class AuthenticateRequest
    {
        [Required]
        public string? Username { get; set; }

        [Required]
        public string? Password { get; set; }
    }
}
