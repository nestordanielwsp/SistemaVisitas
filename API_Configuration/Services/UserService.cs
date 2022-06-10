using BCryptNet = BCrypt.Net.BCrypt;
using API_Configuration.Data;
using API_Configuration.Interfaces;
using API_Configuration.Models;
using API_Configuration.Helpers;
using Microsoft.Extensions.Options;
using AutoMapper;
using API_Configuration.Dtos;
using System.DirectoryServices;

namespace API_Configuration.Services
{
    public class UserService : IUserService
    {
        private  ConfigurationContext context;
        private  IJwtUtils jwtUtils;
        private readonly AppSettings appSettings;
        private readonly IMapper mapper;
        private readonly IConfigurationAPIRepo repository;

        public UserService(ConfigurationContext context, IJwtUtils jwtUtils,IOptions<AppSettings> appSettings, IMapper mapper, IConfigurationAPIRepo repository)
        {
            this.context = context;
            this.jwtUtils = jwtUtils;
            this.appSettings = appSettings.Value;
            this.mapper = mapper;
            this.repository = repository;

        }
        public AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress)
        {
            var user = context.Users.SingleOrDefault(u => u.Email == model.Username);

            if (user == null) throw new AppException("Username or password is incorrect");

            var usuarioValido = false;

            if (user.IsLDAPAuth)
            {

                if (SearchUserInAD(model.Username, model.Password))
                {
                    usuarioValido = true;
                } else
                {
                    throw new AppException("Username or password is incorrect");
                }


            } else
            {


                if (user.Email == "admin" && ((user.PasswordHash == "admin" && model.Password == "admin") || BCryptNet.Verify(model.Password, user.PasswordHash)))
                {
                    usuarioValido = true;
                }
                // validate
                if (!usuarioValido)
                    if (user == null || !BCryptNet.Verify(model.Password, user.PasswordHash))
                        throw new AppException("Username or password is incorrect");
            }


            

            // authentication successful so generate jwt and refresh tokens
            var jwtToken = jwtUtils.GenerateJwtToken(user);
            var refreshToken = jwtUtils.GenerateRefreshToken(ipAddress);
            user.RefreshTokens.Add(refreshToken);

            context.Update(user);
            context.SaveChanges();

            jwtToken.refreshToken = refreshToken.Token;
            jwtToken.refreshTokenExpireIn = refreshToken.ExpiresInMinutes;
            var repoUser = repository.GetUserById(user.UserId);
            var userReadDto = mapper.Map<UserReadDto>(repoUser);

            return new AuthenticateResponse(userReadDto, jwtToken);
        }

        public IEnumerable<User> GetAll()
        {
            throw new NotImplementedException();
        }

        public User GetById(int id)
        {
            throw new NotImplementedException();
        }

        public AuthenticateResponse RefreshToken(string token, string ipAddress)
        {
            var user = getUserByRefreshToken(token);
            var refreshToken = user.RefreshTokens.Single(x => x.Token == token);

            if (refreshToken.IsRevoked)
            {
                // revoke all descendant tokens in case this token has been compromised
                revokeDescendantRefreshTokens(refreshToken, user, ipAddress, $"Attempted reuse of revoked ancestor token: {token}");
                context.Update(user);
                context.SaveChanges();
            }

            if (!refreshToken.IsActive)
                throw new AppException("Invalid token");

            // replace old refresh token with a new one (rotate token)
            var newRefreshToken = rotateRefreshToken(refreshToken, ipAddress);
            user.RefreshTokens.Add(newRefreshToken);

            // remove old refresh tokens from user
            removeOldRefreshTokens(user);

            // save changes to db
            context.Update(user);
            context.SaveChanges();

            // generate new jwt
            var jwtToken = jwtUtils.GenerateJwtToken(user);
            var userReadDto = mapper.Map<UserReadDto>(user);
            jwtToken.refreshToken = newRefreshToken.Token;
            jwtToken.refreshTokenExpireIn = newRefreshToken.ExpiresInMinutes;
            return new AuthenticateResponse(userReadDto, jwtToken);
        }

        public void RevokeToken(string token, string ipAddress)
        {
            var user = getUserByRefreshToken(token);
            var refreshToken = user.RefreshTokens.Single(x => x.Token == token);

            if (!refreshToken.IsActive)
                throw new AppException("Invalid token");

            // revoke token and save
            revokeRefreshToken(refreshToken, ipAddress, "Revoked without replacement");
            context.Update(user);
            context.SaveChanges();
        }

        private User getUserByRefreshToken(string token)
        {
            var user = context.Users.SingleOrDefault(u => u.RefreshTokens.Any(t => t.Token == token));

            if (user == null)
                throw new AppException("Invalid token");

            return user;
        }

        private RefreshToken rotateRefreshToken(RefreshToken refreshToken, string ipAddress)
        {
            var newRefreshToken = jwtUtils.GenerateRefreshToken(ipAddress);
            revokeRefreshToken(refreshToken, ipAddress, "Replaced by new token", newRefreshToken.Token);
            return newRefreshToken;
        }

        private void removeOldRefreshTokens(User user)
        {
            // remove old inactive refresh tokens from user based on TTL in app settings
            user.RefreshTokens.RemoveAll(x =>
                !x.IsActive &&
                x.Created.AddDays(appSettings.RefreshTokenTTL) <= DateTime.UtcNow);
        }

        private void revokeDescendantRefreshTokens(RefreshToken refreshToken, User user, string ipAddress, string reason)
        {
            // recursively traverse the refresh token chain and ensure all descendants are revoked
            if (!string.IsNullOrEmpty(refreshToken.ReplacedByToken))
            {
                var childToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken.ReplacedByToken);
                if (childToken.IsActive)
                    revokeRefreshToken(childToken, ipAddress, reason);
                else
                    revokeDescendantRefreshTokens(childToken, user, ipAddress, reason);
            }
        }

        private void revokeRefreshToken(RefreshToken token, string ipAddress, string reason = null, string replacedByToken = null)
        {
            token.Revoked = DateTime.UtcNow;
            token.RevokedByIp = ipAddress;
            token.ReasonRevoked = reason;
            token.ReplacedByToken = replacedByToken;
        }

        private bool SearchUserInAD(string user, string password)
        {
            DirectoryEntry directoryEntry = new DirectoryEntry(appSettings.LDAP, user, password, AuthenticationTypes.Secure);

            try
            {
                DirectorySearcher searcher = new DirectorySearcher(directoryEntry);

                SearchResult result = searcher.FindOne();

            }
            catch (Exception ex)
            {
                return false;
            }

            return true;
        }
    }
}
