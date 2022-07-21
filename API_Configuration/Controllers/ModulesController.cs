using API_Configuration.Data;
using API_Configuration.Dtos;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using API_Configuration.Models;

namespace API_Configuration.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ModulesController : ControllerBase
    {
        private readonly IConfigurationAPIRepo repository;
        private readonly IMapper mapper;
        public ModulesController(IConfigurationAPIRepo repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        [HttpGet(Name = "GetAllModules")]
        public ActionResult<IEnumerable<ModuleReadDto>> Get()
        {
            var modules = repository.GetAllModules();

            return Ok(mapper.Map<IEnumerable<ModuleReadDto>>(modules));
        }

        [HttpGet("{id}", Name = "GetModuleById")]
        public ActionResult<ModuleReadDto> GetById(int id)
        {
            var moduleItem = repository.GetModuleById(id);

            if (moduleItem == null)
            {
                return NotFound();
            }

            return Ok(mapper.Map<ModuleReadDto>(moduleItem));

        }

        [HttpPost(Name = "PostModule")]
        public ActionResult<ModuleReadDto> Post(ModuleCreateDto module)
        {
            var moduleModel = mapper.Map<Module>(module);

            repository.CreateModule(moduleModel);

            repository.SaveChanges();

            var moduleReadDto = mapper.Map<ModuleReadDto>(moduleModel);

            return CreatedAtRoute(nameof(GetById), new { Id = moduleReadDto.ModuleId }, moduleReadDto);
        }

        [HttpPost("{id}", Name = "PutModule")]
        public ActionResult Put(int id, ModuleUpdateDto moduleUpdateDto)
        {
            var moduleFromRepo = repository.GetModuleById(id);

            if (moduleFromRepo == null)
            {
                return NotFound();
            }

            mapper.Map(moduleUpdateDto, moduleFromRepo);

            repository.SaveChanges();

            return NoContent();
        }
        
        [HttpPost("bulkDisable", Name = "PutDisableModules")]
        public ActionResult PutDisableAll(IdListUpdateDto idListUpdateDto)
        {
            var modulesFromRepo = repository.GetAllModulesByIds(idListUpdateDto);

            if (modulesFromRepo.Count() == 0)
            {
                return NotFound();
            }

            foreach (var moduleFromRepo in modulesFromRepo)
            {
                moduleFromRepo.IsEnabled = false;
            }

            repository.SaveChanges();

            return NoContent();
        }
    }
}
