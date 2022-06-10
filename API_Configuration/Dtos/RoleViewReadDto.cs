namespace API_Configuration.Dtos
{
    public class RoleViewReadDto
    {
        public int RoleViewId { get; set; }
        public int ViewId { get; set; }
        public ViewReadDto? View { get; set; }
        public int RoleId { get; set; }
        public DateTime CreationDate { get; set; }
        public int CreatedBy { get; set; }
    }
}
