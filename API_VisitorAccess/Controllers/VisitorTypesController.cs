using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API_VisitorAccess.Data;
using API_VisitorAccess.Models;

namespace API_VisitorAccess.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VisitorTypesController : ControllerBase
    {
        private readonly API_VisitorAccessContext _context;

        public VisitorTypesController(API_VisitorAccessContext context)
        {
            _context = context;
        }

        // GET: api/VisitorTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VisitorType>>> GetVisitorType([FromQuery] bool? isEnabled)
        {
            return await _context.VisitorType.Where(c => c.IsEnabled == isEnabled || isEnabled == null).ToListAsync();
        }

        // GET: api/VisitorTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VisitorType>> GetVisitorType(int id)
        {
            var visitorType = await _context.VisitorType.FindAsync(id);

            if (visitorType == null)
            {
                return NotFound();
            }

            return visitorType;
        }

        // PUT: api/VisitorTypes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("{id}")]
        public async Task<IActionResult> PutVisitorType(int id, VisitorType visitorType)
        {
            if (id != visitorType.VisitorTypeId)
            {
                return BadRequest();
            }

            _context.Entry(visitorType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VisitorTypeExists(id))
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

        // POST: api/VisitorTypes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<VisitorType>> PostVisitorType(VisitorType visitorType)
        {
            _context.VisitorType.Add(visitorType);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVisitorType", new { id = visitorType.VisitorTypeId }, visitorType);
        }

        // DELETE: api/VisitorTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVisitorType(int id)
        {
            var visitorType = await _context.VisitorType.FindAsync(id);
            if (visitorType == null)
            {
                return NotFound();
            }

            _context.VisitorType.Remove(visitorType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VisitorTypeExists(int id)
        {
            return _context.VisitorType.Any(e => e.VisitorTypeId == id);
        }
    }
}
