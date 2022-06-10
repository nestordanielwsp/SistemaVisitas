namespace API_Configuration.Dtos
{
    public class RoleViewCreateDto
    {
        public int ViewId { get; set; }
        public int RoleId { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public int CreatedBy { get; set; }
    }
}
