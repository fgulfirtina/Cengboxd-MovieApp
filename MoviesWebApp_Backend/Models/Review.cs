using System;
using System.Collections.Generic;

namespace dbms.Models
{
    public partial class Review
    {
        public int ReviewId { get; set; }
        public int? UserId { get; set; }
        public int? MovieId { get; set; }
        public string? Reviewtext { get; set; }
        public int? Rating { get; set; }
        public DateOnly? ReviewDate { get; set; }

        public virtual Movie? Movie { get; set; }
        public virtual User? User { get; set; }
    }
}
