using API_Configuration.Data;
using API_Configuration.Dtos;
using API_Configuration.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API_Configuration.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly IConfigurationAPIRepo repository;
        private readonly IMapper mapper;
        public RolesController(IConfigurationAPIRepo repository,IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        //GET
        [HttpGet(Name = "GetAllRoles")]
        public ActionResult<IEnumerable<RoleReadDto>> Get()
        {
            var roles = repository.GetAllRoles();

            return Ok(mapper.Map<IEnumerable<RoleReadDto>>(roles));
        }
        [HttpGet("AvailableToUser", Name = "GetAllRolesAvailableToUser")]
        public ActionResult<IEnumerable<RoleReadDto>> GetAllRolesAvailableToUser([FromQuery] int userId)
        {
            if (userId <= 0) return NotFound();
            var roles = repository.GetAllRolesAvailableToUser(userId);

            return Ok(mapper.Map<IEnumerable<RoleReadDto>>(roles));
        }

        [HttpGet("{id}", Name = "GetRoleById")]
        public ActionResult<RoleReadDto> GetById(int id)
        {
            var roleItem = repository.GetRoleById(id);

            if (roleItem == null)
            {
                return NotFound();
            }

            return Ok(mapper.Map<RoleReadDto>(roleItem));

        }

        //PUT
        [HttpPut("{id}", Name = "PutRole")]
        public ActionResult Put(int id, RoleUpdateDto roleUpdateDto)
        {
            var roleFromRepo = repository.GetRoleById(id);

            if (roleFromRepo == null)
            {
                return NotFound();
            }

            mapper.Map(roleUpdateDto, roleFromRepo);

            repository.SaveChanges();

            return NoContent();
        }

        [HttpPut("bulkDisable", Name = "PutDisableRoles")]
        public ActionResult PutDisableAll(IdListUpdateDto idListUpdateDto)
        {
            var rolesFromRepo = repository.GetAllRolesByIds(idListUpdateDto);

            if (rolesFromRepo.Count() == 0)
            {
                return NotFound();
            }

            foreach (var roleFromRepo in rolesFromRepo)
            {
                roleFromRepo.IsEnabled = false;
            }

            repository.SaveChanges();

            return NoContent();
        }

        [HttpPut("deleteRoleViews", Name = "BulkDeleteRoleViews")]
        public ActionResult DeleteRoleViews(IdListDeleteDto idListDeleteDto)
        {
            repository.DeleteBulkRoleView(idListDeleteDto);

            repository.SaveChanges();

            return NoContent();
        }

        //POST
        [HttpPost]
        public ActionResult<RoleReadDto> Post(RoleCreateDto role)
        {
            var roleModel = mapper.Map<Role>(role);

            repository.CreateRole(roleModel);

            repository.SaveChanges();

            var roleReadDto = mapper.Map<RoleReadDto>(roleModel);

            return CreatedAtRoute(nameof(GetById), new { Id = roleReadDto.RoleId }, roleReadDto);
        }
        [HttpPost("BulkRoleView")]
        public ActionResult Post(RoleViewBulkCreateDto roleViewBulkCreateDto)
        {

            foreach (var roleViewCreateDto in roleViewBulkCreateDto.RoleViews)
            {
                var roleViewModel = mapper.Map<RoleView>(roleViewCreateDto);

                repository.CreateBulkRoleView(roleViewModel);
            }

            repository.SaveChanges();

            return NoContent();
        }
    }
}
