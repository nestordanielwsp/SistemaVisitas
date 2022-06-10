namespace API_Configuration.Dtos
{
    public class ViewUpdateDto
    {
        public int ModuleId { get; set; }
        public string? Description { get; set; }
        public string? Path { get; set; }
        public bool IsEnabled { get; set; }
        public bool IsHome { get; set; }
    }
}
