namespace API_Configuration.Dtos
{
    public class AreaUpdateDto
    {
        public int AreaId { get; set; }
        public string? Description { get; set; }
        public bool IsEnabled { get; set; }
    }
}
