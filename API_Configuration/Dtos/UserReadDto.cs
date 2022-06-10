namespace API_Configuration.Dtos
{
    public class UserReadDto
    {
        public int UserId { get; set; }
        public int AreaId { get; set; }
        public AreaReadDto? Area { get; set; }
        public string? EmployeeNumber { get; set; }
        public string? Email { get; set; }
        public string? Name { get; set; }
        public string? LastName { get; set; }
        public string? PasswordHash { get; set; }
        public string? Salt { get; set; }
        public string? Image { get; set; }
        public bool IsLDAPAuth { get; set; }
        public bool IsEnabled { get; set; }
        public DateTime CreationDate { get; set; }
        public int CreatedBy { get; set; }
        public IEnumerable<UserRoleReadDto> UserRoles { get; set; } = new List<UserRoleReadDto>();
    }
}
