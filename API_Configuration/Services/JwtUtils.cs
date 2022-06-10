using API_Configuration.Helpers;
using API_Configuration.Interfaces;
using API_Configuration.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace API_Configuration.Services
{
    public class JwtUtils : IJwtUtils
    {
        private readonly AppSettings _appSettings;
        public JwtUtils(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }
        public InfoToken GenerateJwtToken(User user)
        {
            // generate token that is valid for 15 minutes
            int timeValidToken = 10000;
            var tokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", user.UserId.ToString()) }),
                Expires = DateTime.UtcNow.AddMinutes(timeValidToken),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            InfoToken infoToken = new InfoToken();
            infoToken.token = tokenHandler.WriteToken(token);
            infoToken.expiresIn = timeValidToken;

            return infoToken;
        }

        public record InfoToken {
            public string? token { get; set; }
            public int expiresIn { get; set; }
            public string? refreshToken { get; set; }
            public int refreshTokenExpireIn { get; set; }
        }

        public RefreshToken GenerateRefreshToken(string ipAddress)
        {
            // generate token that is valid for 7 days
            using var rngCryptoServiceProvider = new RSACryptoServiceProvider();

            var randomBytes = new byte[64];

            //rngCryptoServiceProvider.GetBytes(randomBytes);

            rngCryptoServiceProvider.Encrypt(randomBytes, false);
            int timeExpireInMinutes = 10080; //7 Days
            var refreshToken = new RefreshToken
            {
                Token = Convert.ToBase64String(rngCryptoServiceProvider.Encrypt(randomBytes, false)),
                Expires = DateTime.UtcNow.AddMinutes(timeExpireInMinutes), 
                ExpiresInMinutes = timeExpireInMinutes,
                Created = DateTime.UtcNow,
                CreatedByIp = ipAddress
            };

            return refreshToken;
        }

        public int? ValidateJwtToken(string token)
        {
            if (token == null)
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;

                var userId = int.Parse(jwtToken.Claims.First(x => x.Type == "id").Value);

                // return user id from JWT token if validation successful
                return userId;
            }
            catch
            {
                // return null if validation fails
                return null;
            }
        }
    }
}
