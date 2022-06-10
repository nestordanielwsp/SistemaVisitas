namespace API_Configuration.Dtos
{
    public class AreaReadDto
    {
        public int AreaId { get; set; }
        public string? Description { get; set; }
        public bool IsEnabled { get; set; }
        public DateTime CreationDate { get; set; }
        public int CreatedBy { get; set; }
    }
}
