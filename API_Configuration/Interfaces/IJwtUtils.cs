using API_Configuration.Models;

namespace API_Configuration.Interfaces
{
    public interface IJwtUtils
    {
        public Services.JwtUtils.InfoToken GenerateJwtToken(User user);

        public int? ValidateJwtToken(string token);

        RefreshToken GenerateRefreshToken(string ipAddress);
    }
}
