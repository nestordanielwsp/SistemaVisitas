using API_Configuration.Data;
using API_Configuration.Helpers;
using API_Configuration.Interfaces;
using Microsoft.Extensions.Options;

namespace API_Configuration.Middleware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly AppSettings _appSettings;
        //private readonly IJwtUtils jwtUtils;

        public JwtMiddleware(RequestDelegate next, IOptions<AppSettings> appSettings)
        {
            _next = next;
            _appSettings = appSettings.Value;
            //this.jwtUtils = jwtUtils;
        }

        public async Task Invoke(HttpContext context, IConfigurationAPIRepo userService, IJwtUtils jwtUtils)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            var userId = jwtUtils.ValidateJwtToken(token);
            if (userId != null)
            {
                // attach user to context on successful jwt validation
                context.Items["User"] = userService.GetUserById(userId.Value);
            }

            await _next(context);
        }

    }
}
