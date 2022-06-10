namespace API_Configuration.Dtos
{
    public class ModuleUpdateDto
    {
        public int ModuleId { get; set; }
        public string? Description { get; set; }
        public bool IsEnabled { get; set; }
    }
}
