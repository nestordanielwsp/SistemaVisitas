namespace API_Configuration.Dtos
{
    public class RoleUpdateDto
    {
        public int ModuleId { get; set; }
        public int RoleId { get; set; }
        public string? Description { get; set; }
        public bool IsEnabled { get; set; }
    }
}
