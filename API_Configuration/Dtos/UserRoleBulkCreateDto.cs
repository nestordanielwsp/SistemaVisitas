namespace API_Configuration.Dtos
{
    public class UserRoleBulkCreateDto
    {
        public IEnumerable<UserRoleCreateDto> UserRoles { get; set; } = new List<UserRoleCreateDto>();
    }
}
