namespace API_Configuration.Dtos
{
    public class RoleReadDto
    {
        public int RoleId { get; set; }
        public int ModuleId { get; set; }
        public ModuleReadDto? Module { get; set; }
        public string? Description { get; set; }
        public bool IsEnabled { get; set; }
        public DateTime CreationDate { get; set; }
        public int CreatedBy { get; set; }
        public IEnumerable<RoleViewReadDto> RoleViews { get; set; } = new List<RoleViewReadDto>();
    }
}
