namespace API_Configuration.Dtos
{
    public class RoleCreateDto
    {
        public int ModuleId { get; set; }
        public string? Description { get; set; }
        public bool IsEnabled { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
    }
}
