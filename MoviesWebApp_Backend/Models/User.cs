using System;
using System.Collections.Generic;

namespace dbms.Models
{
    public partial class User
    {
        public User()
        {
            Favorites = new HashSet<Favorite>();
            Reviews = new HashSet<Review>();
            Watchlists = new HashSet<Watchlist>();
        }

        public int UserId { get; set; }
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? Name { get; set; }
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public DateOnly? JoinDate { get; set; }
        public string? Profilepic { get; set; }
        public string? Usertype { get; set; }

        public virtual ICollection<Favorite> Favorites { get; set; }
        public virtual ICollection<Review> Reviews { get; set; }
        public virtual ICollection<Watchlist> Watchlists { get; set; }
    }
}
