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
    public class DeviceTypesController : ControllerBase
    {
        private readonly API_VisitorAccessContext _context;

        public DeviceTypesController(API_VisitorAccessContext context)
        {
            _context = context;
        }

        // GET: api/DeviceTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeviceType>>> GetDeviceType([FromQuery] bool? isEnabled)
        {
            return await _context.DeviceType.Where(c => c.IsEnabled == isEnabled || isEnabled == null).ToListAsync();
        }

        // GET: api/DeviceTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DeviceType>> GetDeviceType(int id)
        {
            var deviceType = await _context.DeviceType.FindAsync(id);

            if (deviceType == null)
            {
                return NotFound();
            }

            return deviceType;
        }

        // PUT: api/DeviceTypes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDeviceType(int id, DeviceType deviceType)
        {
            if (id != deviceType.DeviceTypeId)
            {
                return BadRequest();
            }

            _context.Entry(deviceType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeviceTypeExists(id))
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

        // POST: api/DeviceTypes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DeviceType>> PostDeviceType(DeviceType deviceType)
        {
            _context.DeviceType.Add(deviceType);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDeviceType", new { id = deviceType.DeviceTypeId }, deviceType);
        }

        // DELETE: api/DeviceTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDeviceType(int id)
        {
            var deviceType = await _context.DeviceType.FindAsync(id);
            if (deviceType == null)
            {
                return NotFound();
            }

            _context.DeviceType.Remove(deviceType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DeviceTypeExists(int id)
        {
            return _context.DeviceType.Any(e => e.DeviceTypeId == id);
        }
    }
}
