namespace API_Configuration.Dtos
{
    public class UserRoleCreateDto
    {
        public int RoleId { get; set; }
        public int UserId { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public int CreatedBy { get; set; }
    }
}
