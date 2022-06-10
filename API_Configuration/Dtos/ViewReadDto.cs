
namespace API_Configuration.Dtos
{
    public class ViewReadDto
    {
        public int ViewId { get; set; }
        public int ModuleId { get; set; }
        public ModuleReadDto? Module { get; set; }
        public string? Description { get; set; }
        public string? Path { get; set; }
        public bool IsEnabled { get; set; }
        public bool IsHome { get; set; }
        public DateTime CreationDate { get; set; }
        public int CreatedBy { get; set; }
    }
}
