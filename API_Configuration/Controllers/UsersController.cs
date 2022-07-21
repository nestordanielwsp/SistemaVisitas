using API_Configuration.Authorization;
using API_Configuration.Data;
using API_Configuration.Dtos;
using API_Configuration.Interfaces;
using API_Configuration.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API_Configuration.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IConfigurationAPIRepo repository;
        private readonly IMapper mapper;
        private readonly IConfiguration config;
        private readonly IUserService userService;
        public UsersController(IConfigurationAPIRepo repository,IMapper mapper, IConfiguration config,IUserService userService)
        {
            this.repository = repository;
            this.mapper = mapper;
            this.config = config;
            this.userService = userService;
        }
        //POST
        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate(AuthenticateRequest model)
        {
            var response = userService.Authenticate(model, ipAddress());
            //setTokenCookie(response.JwtToken.refreshToken);
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost("refresh-token")]
        public IActionResult RefreshToken([FromBody] ParamRefresTokenRequest paramRefreshToken)
        {
            //var refreshToken = Request.Cookies["refreshToken"];
            var response = userService.RefreshToken(paramRefreshToken.refreshToken, ipAddress());
            //setTokenCookie(response.JwtToken.refreshToken);
            return Ok(response);
        }

        public record ParamRefresTokenRequest {
            public string refreshToken { get; set; } = "";
            public string oldAuthToken { get; set; } = "";
        }

        [HttpPost("revoke-token")]
        public IActionResult RevokeToken(RevokeTokenRequest model)
        {
            // accept refresh token in request body or cookie
            var token = model.Token; //?? Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(token))
                return BadRequest(new { message = "Token is required" });

            userService.RevokeToken(token, ipAddress());

            return Ok(new { message = "Token revoked" });
        }

        [HttpPost(Name = "PostUser")]
        public async Task<ActionResult<UserReadDto>> Post([FromForm] UserCreateDto user)
        {
            var userModel = mapper.Map<User>(user);

            //SUBIR ARCHIVO AL SERVER
            if (user.ImageFile != null)
            {
                string name_file = $"{Guid.NewGuid()}{Path.GetExtension(user.ImageFile.FileName)}";
                string name_folder = Path.Combine(@"CONFIG/PROFILE".Split('/'));
                string filesAppPath = config.GetValue<string>("FilesAppPath");
                string pathToSave = Path.Combine(filesAppPath, name_folder, name_file);

                Directory.CreateDirectory(Path.Combine(filesAppPath, name_folder));
                using (var stream = System.IO.File.Create(pathToSave))
                {
                    await user.ImageFile.CopyToAsync(stream);
                }
                userModel.Image = name_file;
            }

            //GENERAR PASS HASH
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);
            userModel.PasswordHash = passwordHash;

            repository.CreateUser(userModel);

            repository.SaveChanges();

            var userReadDto = mapper.Map<UserReadDto>(userModel);

            return CreatedAtRoute(nameof(GetById), new { Id = userReadDto.UserId }, userReadDto);
        }
        [HttpPost("BulkUserRole")]
        public ActionResult PostBulkUserRole(UserRoleBulkCreateDto userRoleBulkCreateDto)
        {

            foreach (var userRoleCreateDto in userRoleBulkCreateDto.UserRoles)
            {
                var userRoleModel = mapper.Map<UserRole>(userRoleCreateDto);

                repository.CreateBulkUserRole(userRoleModel);
                repository.SaveChanges();
            }
            
            return NoContent();
        }
        //GET
        [HttpGet(Name = "GetAllusers")]
        public ActionResult<IEnumerable<UserReadDto>> Get([FromQuery] bool? isEnabled)
        {
            var users = repository.GetAllUsers(isEnabled);

            return Ok(mapper.Map<IEnumerable<UserReadDto>>(users));
        }

        [HttpGet("{id}",Name ="GetUserById")]
        public ActionResult<UserReadDto> GetById(int id)
        {
            var userItem = repository.GetUserById(id);

            if (userItem == null)
            {
                return NotFound();
            }
            var result = mapper.Map<UserReadDto>(userItem);
            return Ok(result);
        }

        //PUT
        [HttpPost("{id}", Name = "PutUser")]
        public async Task<ActionResult> PutAsync(int id, [FromForm] UserUpdateDto userUpdateDto)
        {
            var userFromRepo = repository.GetUserById(id);

            if (userFromRepo == null)
            {
                return NotFound();
            }

            //SUBIR ARCHIVO AL SERVER
            if (userUpdateDto.ImageFile != null)
            {
                string name_file = $"{Guid.NewGuid()}{Path.GetExtension(userUpdateDto.ImageFile.FileName)}";
                string name_folder = Path.Combine(@"CONFIG/PROFILE".Split('/'));
                string filesAppPath = config.GetValue<string>("FilesAppPath");
                string pathToSave = Path.Combine(filesAppPath, name_folder, name_file);

                Directory.CreateDirectory(Path.Combine(filesAppPath, name_folder));
                using (var stream = System.IO.File.Create(pathToSave))
                {
                    await userUpdateDto.ImageFile.CopyToAsync(stream);
                }
                //ELIMINA ARCHIVO PREVIO
                if(userFromRepo.Image != null)
                {
                    if(System.IO.File.Exists(Path.Combine(filesAppPath, name_folder, userFromRepo.Image)))
                        System.IO.File.Delete(Path.Combine(filesAppPath, name_folder, userFromRepo.Image));
                }
                userFromRepo.Image = name_file;
            }

            mapper.Map(userUpdateDto, userFromRepo);
            repository.SaveChanges();

            return NoContent();
        }

        [HttpPost("ChangePassword", Name = "PutUserChangePassword")]
        public ActionResult PutChangePasswordAsync(UserPasswordDto userPasswordDto)
        {
            var userItem = repository.GetUserById(userPasswordDto.UserId);
            if (userItem == null)
            {
                return NotFound();
            }

            //GENERAR PASS HASH
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(userPasswordDto.Password);
            userItem.PasswordHash = passwordHash;

            repository.UserChangePassword(userItem);

            repository.SaveChanges();

            return NoContent();
        }


        [HttpPost("bulkDisable", Name = "PutDisableUsers")]
        public ActionResult PutDisableAll(IdListUpdateDto idListUpdateDto)
        {
            var usersFromRepo = repository.GetAllUsersByIds(idListUpdateDto);

            if (usersFromRepo.Count() == 0)
            {
                return NotFound();
            }

            foreach (var userFromRepo in usersFromRepo)
            {
                userFromRepo.IsEnabled = false;
            }

            repository.SaveChanges();

            return NoContent();
        }

        [HttpPost("deleteUserRoles", Name = "PutDeleteUserRole")]
        public ActionResult DeleteUserRoleAsync(IdListDeleteDto idListDeleteDto)
        {
            repository.DeleteBulkUserRole(idListDeleteDto);

            repository.SaveChanges();

            return NoContent();
        }

        private void setTokenCookie(string token)
        {
            // append cookie with refresh token to the http response
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", token, cookieOptions);
        }

        private string ipAddress()
        {
            // get source ip address for the current request
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
                return Request.Headers["X-Forwarded-For"];
            else
                return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
        }
    }
}
