using System;
using System.Collections.Generic;

namespace dbms.Models
{
    public partial class Watchlist
    {
        public int UserId { get; set; }
        public int MovieId { get; set; }
        public DateOnly? Adddate { get; set; }

        public virtual Movie Movie { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
}
