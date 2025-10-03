
using dbms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Bcpg.OpenPgp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dbms.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActorController : ControllerBase
    {
        private readonly postgresContext _context;

        public ActorController(postgresContext context)
        {
            _context = context;
        }

        [HttpGet("/get-actors/{movieId}")]
        public async Task<IActionResult> GetActors(int movieId)
        {
            try
            {
                var actors = await _context
                    .Set<Actor>()
                    .FromSqlRaw("SELECT actor_name FROM get_movie_actors({0})", movieId)
                    .Select(x => x.ActorName)
                    .ToListAsync();

                return Ok(actors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching actors", error = ex.Message });
            }
        }

        [HttpGet("/get-all-actors")]
        
        public async Task<IActionResult> GetAllActors()
        {
            var actors= await _context.Actors
            .Select(actor => new
            {
                actor.ActorId,
                actor.ActorName,
                actor.Biography,
                actor.Birtdate,
                actor.Nationality,
                actor.Awards

            }).ToListAsync();

            return Ok(actors);
        }

        [HttpPost("/add-actor")]
        public async Task<IActionResult> AddActor([FromBody] string newActorName)
        {
            if (string.IsNullOrEmpty(newActorName))
            {
                return BadRequest(new { message = "Actor name is required" });
            }

            try
            {
                await _context.Database.ExecuteSqlRawAsync("SELECT add_actor({0})", newActorName);

                return Ok(new { message = "Actor added successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error adding actor", error = ex.Message });
            }
        }

        [HttpDelete("/delete-actor/{actorId}")]
        public async Task<IActionResult> DeleteDirector(int actorId)
        {
            if (actorId <= 0)
            {
                return BadRequest(new { message = "Invalid actor ID." });
            }
            try
            {
                await _context.Database.ExecuteSqlRawAsync("SELECT delete_actor({0})", actorId);

                return Ok(new { message = "actor deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting actor", error = ex.Message });
            }
        }

        [HttpPut("/edit-actor/{actorId}")]
        public async Task<IActionResult> EditActor(int actorId, [FromBody] Actor updatedActor)
        {
            if (actorId <= 0 || updatedActor == null)
            {
                return BadRequest(new { message = "Invalid actor ID or data." });
            }

            try
            {
                var existingActor = await _context.Actors.FindAsync(actorId);
                if (existingActor == null)
                {
                    return NotFound(new { message = "Actor not found." });
                }

                // Update fields
                existingActor.ActorName = updatedActor.ActorName ?? existingActor.ActorName;
                existingActor.Biography = updatedActor.Biography ?? existingActor.Biography;
                existingActor.Birtdate = updatedActor.Birtdate ?? existingActor.Birtdate;
                existingActor.Nationality = updatedActor.Nationality ?? existingActor.Nationality;
                existingActor.Awards = updatedActor.Awards ?? existingActor.Awards;

                // Save changes
                await _context.SaveChangesAsync();

                return Ok(new { message = "Actor updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating actor", error = ex.Message });
            }
        }

        [HttpGet("/get-actor-withId/{actorId}")]
        public async Task<IActionResult> GetActorById(int actorId)
        {
            if (actorId <= 0)
            {
                return BadRequest(new { message = "Invalid actor ID." });
            }

            try
            {
                var actor = await _context.Actors
                    .Where(a => a.ActorId == actorId)
                    .Select(a => new
                    {
                        a.ActorId,
                        a.ActorName,
                        a.Biography,
                        a.Birtdate,
                        a.Nationality,
                        a.Awards
                    })
                    .FirstOrDefaultAsync();

                if (actor == null)
                {
                    return NotFound(new { message = "Actor not found." });
                }

                return Ok(actor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching actor details", error = ex.Message });
            }
        }

        [HttpGet("/actor-details/{actorName}")]
        public async Task<IActionResult> GetActorDetails(string actorName)
        {
            try
            {
                // Fetch actor details from the database based on actorName
                var actor = await _context.Actors
                    .Where(a => a.ActorName == actorName)
                    .FirstOrDefaultAsync();

                if (actor == null)
                {
                    return NotFound(new { message = "Actor not found" });
                }

                return Ok(actor); // Make sure to return the actor's details
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching actor details", error = ex.Message });
            }
        }
    }
}
