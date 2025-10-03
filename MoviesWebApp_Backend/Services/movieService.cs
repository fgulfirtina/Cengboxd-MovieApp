using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using dbms.Models;

namespace dbms.Services
{
    public class movieService
    {
        private readonly postgresContext _context;

        public movieService(postgresContext context)
        {
            _context = context;
        }

        public async Task<List<Movie>> GetAllMoviesAsync()
        {
            return await _context.Movies.ToListAsync();
        }
    }
}
