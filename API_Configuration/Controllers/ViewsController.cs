using API_Configuration.Data;
using API_Configuration.Dtos;
using API_Configuration.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API_Configuration.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ViewsController : ControllerBase
    {
        private readonly IConfigurationAPIRepo repository;
        private readonly IMapper mapper;
        public ViewsController(IConfigurationAPIRepo repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        //GET
        [HttpGet(Name = "GetAllViews")]
        public ActionResult<IEnumerable<ViewReadDto>> Get([FromQuery] int? filterModuleId)
        {
            var views = repository.GetAllViews(filterModuleId);

            return Ok(mapper.Map<IEnumerable<ViewReadDto>>(views));
        }

        [HttpGet("{id}", Name = "GetViewById")]
        public ActionResult<ViewReadDto> GetById(int id)
        {
            var moduleViewItem = repository.GetViewById(id);

            if (moduleViewItem == null)
            {
                return NotFound();
            }

            return Ok(mapper.Map<ViewReadDto>(moduleViewItem));

        }
                
        //POST
        [HttpPost(Name = "PostView")]
        public ActionResult<ViewReadDto> Post(ViewCreateDto view)
        {
            var viewModel = mapper.Map<View>(view);

            repository.CreateView(viewModel);
            repository.SaveChanges();

            var viewReadDto = mapper.Map<ViewReadDto>(viewModel);

            return CreatedAtRoute(nameof(GetById), new { Id = viewReadDto.ViewId }, viewReadDto);
        }

        

        //PUT
        [HttpPut("{id}", Name = "PutView")]
        public ActionResult Put(int id, ViewUpdateDto viewUpdateDto)
        {
            var viewFromRepo = repository.GetViewById(id);

            if (viewFromRepo == null)
            {
                return NotFound();
            }

            mapper.Map(viewUpdateDto, viewFromRepo);

            repository.SaveChanges();

            return NoContent();
        }

        [HttpPut("bulkDisable", Name = "PutDisableViews")]
        public ActionResult PutDisableAll(IdListUpdateDto idListUpdateDto)
        {
            var viewsFromRepo = repository.GetAllViewsByIds(idListUpdateDto);

            if (viewsFromRepo.Count() == 0)
            {
                return NotFound();
            }

            foreach (var viewFromRepo in viewsFromRepo)
            {
                viewFromRepo.IsEnabled = false;
            }

            repository.SaveChanges();

            return NoContent();
        }
    }
}
