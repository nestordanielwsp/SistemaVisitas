namespace API_Configuration.Dtos
{
    public class UserRoleReadDto
    {
        public int UserRoleId { get; set; }
        public RoleReadDto? Role { get; set; }
    }
}
