using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API_VisitorAccess.Data;
using API_VisitorAccess.Models;
using System.ComponentModel.DataAnnotations;

namespace API_VisitorAccess.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SecurityCoursesController : ControllerBase
    {
        private readonly API_VisitorAccessContext _context;
        private readonly IConfiguration _config;

        public SecurityCoursesController(API_VisitorAccessContext context, IConfiguration iconfig)
        {
            _context = context;
            _config = iconfig;
        }

        // GET: api/SecurityCourses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SecurityCourse>>> GetSecurityCourse([FromQuery] bool? isEnabled)
        {
            return await _context.SecurityCourse.Where(s => s.IsEnabled == isEnabled || isEnabled == null).ToListAsync();
        }

        // GET: api/SecurityCourses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SecurityCourse>> GetSecurityCourse(int id)
        {
            var securityCourse = await _context.SecurityCourse.FindAsync(id);

            if (securityCourse == null)
            {
                return NotFound();
            }

            return securityCourse;
        }
        public record SecurityCourseUpdate()
        {
            [Required]
            public int SecurityCourseId { get; set; }
            [Required]
            public string? Description { get; set; }
            public IFormFile? FileCourse { get; set; }
            [Required]
            public bool IsEnabled { get; set; }
        }
        // PUT: api/SecurityCourses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSecurityCourse(int id, [FromForm]SecurityCourseUpdate securityCourseUpdate)
        {
            if (id != securityCourseUpdate.SecurityCourseId) return BadRequest();
            var securityCourseEnabled = await _context.SecurityCourse.AsNoTracking().Where(s => s.IsEnabled == true).ToListAsync();
            if (securityCourseEnabled.Count() > 0 && securityCourseUpdate.IsEnabled == true) return ValidationProblem("There can only be one active course");
            var temp = await _context.SecurityCourse.FirstOrDefaultAsync(c => c.SecurityCourseId == id);

            try
            {
                temp.Description = securityCourseUpdate.Description;
                temp.IsEnabled = securityCourseUpdate.IsEnabled;

                //SUBIR ARCHIVO AL SERVER
                if (securityCourseUpdate.FileCourse != null)
                {
                    string name_file = $"{Guid.NewGuid()}{Path.GetExtension(securityCourseUpdate.FileCourse.FileName)}";
                    string name_folder = Path.Combine(@"SEC_VM/COURSES".Split('/'));
                    string filesAppPath = _config.GetValue<string>("FilesAppPath");
                    string pathToSave = Path.Combine(filesAppPath, name_folder, name_file);

                    Directory.CreateDirectory(Path.Combine(filesAppPath, name_folder));
                    using (var stream = System.IO.File.Create(pathToSave))
                    {
                        await securityCourseUpdate.FileCourse.CopyToAsync(stream);
                    }
                    //ELIMINA ARCHIVO PREVIO
                    if (temp.FileName != null)
                    {
                        if (System.IO.File.Exists(Path.Combine(filesAppPath, name_folder, temp.FileName)))
                            System.IO.File.Delete(Path.Combine(filesAppPath, name_folder, temp.FileName));
                    }
                    temp.FileName = name_file;
                }
                _context.SecurityCourse.Update(temp);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SecurityCourseExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/SecurityCourses/CourseRegistred
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("CourseRegistred")]
        public async Task<IActionResult> PutSecurityCourseCourseRegistred(VisitRecordSecCourseRegistred visitRecordSecCourseRegistred)
        {
            if (!SecurityCourseExists(visitRecordSecCourseRegistred.SecurityCourseId)) return NotFound();

            try
            {
                _context.SecurityCourseRecord.Add(new SecurityCourseRecord
                {
                    RegistryDate = DateTime.Now,
                    ExpirationDate = DateTime.Now.AddMonths(6),
                    VisitorId = visitRecordSecCourseRegistred.VisitorId,
                    SecurityCourseId = visitRecordSecCourseRegistred.SecurityCourseId
                });
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }
        public record VisitRecordSecCourseRegistred()
        {
            [Required]
            public int VisitorId { get; set; }
            [Required]
            public int SecurityCourseId { get; set; }
        }
        // POST: api/SecurityCourses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SecurityCourse>> PostSecurityCourse([FromForm] SecurityCourseCreate securityCourseCreate)
        {
            var securityCourseEnabled = await _context.SecurityCourse.AsNoTracking().Where(s => s.IsEnabled == true).ToListAsync();
            //SUBIR ARCHIVO AL SERVER
            if (securityCourseCreate.FileCourse != null)
            {
                string name_file = $"{Guid.NewGuid()}{Path.GetExtension(securityCourseCreate.FileCourse.FileName)}";
                string name_folder = Path.Combine(@"SEC_VM/COURSES".Split('/'));
                string filesAppPath = _config.GetValue<string>("FilesAppPath");
                string pathToSave = Path.Combine(filesAppPath, name_folder, name_file);

                Directory.CreateDirectory(Path.Combine(filesAppPath, name_folder));
                using (var stream = System.IO.File.Create(pathToSave))
                {
                    await securityCourseCreate.FileCourse.CopyToAsync(stream);
                }

                SecurityCourse securityCourse = new SecurityCourse
                {
                    Description = securityCourseCreate.Description,
                    RegistryDate = DateTime.Now,
                    IsEnabled = (securityCourseEnabled.Count() == 0),
                    FileName = name_file
                };
                _context.SecurityCourse.Add(securityCourse);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetSecurityCourse", new { id = securityCourse.SecurityCourseId }, securityCourse);
            }

            return ValidationProblem("Need to upload a file");
        }

        public record SecurityCourseCreate() {
            [Required]
            public string? Description { get; set; }
            [Required]
            public IFormFile FileCourse { get; set; }
        }

        // DELETE: api/SecurityCourses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSecurityCourse(int id)
        {
            var securityCourse = await _context.SecurityCourse.FindAsync(id);
            if (securityCourse == null)
            {
                return NotFound();
            }

            var tempSecCourseRecord = _context.SecurityCourseRecord.Where(scr => scr.SecurityCourseId == id).FirstOrDefault();
            if (tempSecCourseRecord != null)
            {
                securityCourse.IsEnabled = false;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            string name_folder = Path.Combine(@"SEC_VM/COURSES".Split('/'));
            string filesAppPath = _config.GetValue<string>("FilesAppPath");
            //ELIMINA ARCHIVO PREVIO
            if (securityCourse.FileName != null)
            {
                if (System.IO.File.Exists(Path.Combine(filesAppPath, name_folder, securityCourse.FileName)))
                    System.IO.File.Delete(Path.Combine(filesAppPath, name_folder, securityCourse.FileName));
            }
            _context.SecurityCourse.Remove(securityCourse);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SecurityCourseExists(int id)
        {
            return _context.SecurityCourse.Any(e => e.SecurityCourseId == id);
        }
    }
}
