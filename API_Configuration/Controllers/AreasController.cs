using API_Configuration.Data;
using API_Configuration.Dtos;
using API_Configuration.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API_Configuration.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AreasController : ControllerBase
    {
        private readonly IConfigurationAPIRepo repository;
        private readonly IMapper mapper;
        public AreasController(IConfigurationAPIRepo repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        [HttpGet(Name = "GetAllAreas")]
        public ActionResult<IEnumerable<AreaReadDto>> Get()
        {
            var areas = repository.GetAllAreas();

            return Ok(mapper.Map<IEnumerable<AreaReadDto>>(areas));
        }

        [HttpGet("{id}", Name = "GetById")]
        public ActionResult<AreaReadDto> GetById(int id)
        {
            var areaItem = repository.GetAreaById(id);

            if (areaItem == null)
            {
                return NotFound();
            }

            return Ok(mapper.Map<AreaReadDto>(areaItem));

        }

        [HttpPost]
        public ActionResult<AreaReadDto> Post(AreaCreateDto area)
        {
            var areaModel = mapper.Map<Area>(area);

            repository.CreateArea(areaModel);

            repository.SaveChanges();

            var areaReadDto = mapper.Map<AreaReadDto>(areaModel);

            return CreatedAtRoute(nameof(GetById), new { Id = areaReadDto.AreaId }, areaReadDto);
        }

        [HttpPost("{id}",Name ="PutArea")]
        public ActionResult Put(int id,AreaUpdateDto areaUpdateDto)
        {
            var areaFromRepo = repository.GetAreaById(id);

            if(areaFromRepo == null)
            {
                return NotFound();
            }

            mapper.Map(areaUpdateDto, areaFromRepo);

            repository.SaveChanges();

            return NoContent();
        }

        [HttpPost("bulkDisable", Name = "PutDisableAreas")]
        public ActionResult PutDisableAll(IdListUpdateDto idListUpdateDto)
        {
            var areasFromRepo = repository.GetAllAreasByIds(idListUpdateDto);

            if (areasFromRepo.Count() == 0)
            {
                return NotFound();
            }

            foreach (var areaFromRepo in areasFromRepo)
            {
                areaFromRepo.IsEnabled = false;
            }
            
            repository.SaveChanges();

            return NoContent();
        }
    }
}
