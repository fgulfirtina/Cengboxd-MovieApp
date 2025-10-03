using System;
using System.Collections.Generic;

namespace dbms.Models
{
    public partial class Actor
    {
        public Actor()
        {
            Movies = new HashSet<Movie>();
        }

        public int ActorId { get; set; }
        public string ActorName { get; set; } = null!;
        public string? Biography { get; set; }
        public string? Awards { get; set; }
        public DateOnly? Birtdate { get; set; }
        public string? Nationality { get; set; }

        public virtual ICollection<Movie> Movies { get; set; }
    }
}
