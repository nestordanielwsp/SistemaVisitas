using API_Configuration.Dtos;
using API_Configuration.Models;
using System.Text.Json.Serialization;

namespace API_Configuration.Models
{
    public class AuthenticateResponse
    {
        public UserReadDto user { get; set; }
        public Services.JwtUtils.InfoToken JwtToken { get; set; }

        public AuthenticateResponse(UserReadDto userDto, Services.JwtUtils.InfoToken infoToken)
        {
            user = userDto;
            JwtToken = infoToken;
        }
    }
}
