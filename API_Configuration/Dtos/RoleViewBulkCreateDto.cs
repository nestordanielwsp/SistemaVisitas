namespace API_Configuration.Dtos
{
    public class RoleViewBulkCreateDto
    {
        public IEnumerable<RoleViewCreateDto> RoleViews { get; set; } = new List<RoleViewCreateDto>();
    }
}
