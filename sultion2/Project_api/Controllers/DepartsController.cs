using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_api.Data;
using Project_api.Model;

namespace Project_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartsController : ControllerBase
    {
        private readonly ProjDbcontext _context;

        public DepartsController(ProjDbcontext context)
        {
            _context = context;
        }

        // GET: api/Departs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Depart>>> GetDeparts()
        {
            return await _context.Departs.ToListAsync();
        }

        // GET: api/Departs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Depart>> GetDepart(int id)
        {
            var depart = await _context.Departs.FindAsync(id);

            if (depart == null)
            {
                return NotFound();
            }

            return depart;
        }

        // PUT: api/Departs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDepart(int id, Depart depart)
        {
            if (id != depart.Id)
            {
                return BadRequest();
            }

            _context.Entry(depart).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DepartExists(id))
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

        // POST: api/Departs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Depart>> PostDepart(Depart depart)
        {
            _context.Departs.Add(depart);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDepart", new { id = depart.Id }, depart);
        }

        // DELETE: api/Departs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepart(int id)
        {
            var depart = await _context.Departs.FindAsync(id);
            if (depart == null)
            {
                return NotFound();
            }

            _context.Departs.Remove(depart);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DepartExists(int id)
        {
            return _context.Departs.Any(e => e.Id == id);
        }

       [HttpPost("login")]
       public async Task<IActionResult> Login([FromBody]  string name, string pass) 
        {
        if(string.IsNullOrEmpty(name)|| string.IsNullOrEmpty(pass))
                {
                return BadRequest();
            }
        var user =await _context.Departs.SingleOrDefaultAsync(d=>d.Name==name && d.Locatin== pass);
            if (user == null) 
            {
                return NotFound();
            }
            return  Ok( new
            {
              Users=  user,
              status= "تم التسجيل"
            });

        }
    }
}
