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
    public class SecurityBadgesController : ControllerBase
    {
        private readonly API_VisitorAccessContext _context;

        public SecurityBadgesController(API_VisitorAccessContext context)
        {
            _context = context;
        }

        // GET: api/SecurityBadges
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SecurityBadge>>> GetSecurityBadge([FromQuery] bool? isEnabled, bool? isAvailable)
        {
            if(isAvailable == true && isEnabled == true)
            {
                var secBadgesNoAvailable = _context.VisitRecord.Where(vr => vr.DepartureDate == null && vr.SecurityBadgeId != null).Select(vr => vr.SecurityBadgeId).ToList();
                return await _context.SecurityBadge.Where(c => c.IsEnabled == isEnabled && !secBadgesNoAvailable.Contains(c.SecurityBadgeId)).ToListAsync();
            }
            return await _context.SecurityBadge.Where(c => c.IsEnabled == isEnabled || isEnabled == null).ToListAsync();
        }

        // GET: api/SecurityBadges/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SecurityBadge>> GetSecurityBadge(int id)
        {
            var securityBadge = await _context.SecurityBadge.FindAsync(id);

            if (securityBadge == null)
            {
                return NotFound();
            }

            return securityBadge;
        }

        // PUT: api/SecurityBadges/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSecurityBadge(int id, SecurityBadge securityBadge)
        {
            if (id != securityBadge.SecurityBadgeId)
            {
                return BadRequest();
            }

            _context.Entry(securityBadge).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SecurityBadgeExists(id))
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

        // POST: api/SecurityBadges
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SecurityBadge>> PostSecurityBadge(SecurityBadge securityBadge)
        {
            _context.SecurityBadge.Add(securityBadge);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSecurityBadge", new { id = securityBadge.SecurityBadgeId }, securityBadge);
        }

        // DELETE: api/SecurityBadges/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSecurityBadge(int id)
        {
            var securityBadge = await _context.SecurityBadge.FindAsync(id);
            if (securityBadge == null)
            {
                return NotFound();
            }

            _context.SecurityBadge.Remove(securityBadge);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SecurityBadgeExists(int id)
        {
            return _context.SecurityBadge.Any(e => e.SecurityBadgeId == id);
        }
    }
}
