using System;
using System.Collections.Generic;

namespace dbms.Models
{
    public partial class Movie
    {
        public Movie()
        {
            Favorites = new HashSet<Favorite>();
            Reviews = new HashSet<Review>();
            Watchlists = new HashSet<Watchlist>();
            Actors = new HashSet<Actor>();
            Directors = new HashSet<Director>();
            Genres = new HashSet<Genre>();
        }

        public int MovieId { get; set; }
        public string MovieName { get; set; } = null!;
        public decimal? MovieScore { get; set; }
        public DateOnly? ReleaseDate { get; set; }
        public int? Duration { get; set; }
        public string? Description { get; set; }
        public string? Imageurl { get; set; }
        public string? Trailerurl { get; set; }

        public virtual ICollection<Favorite> Favorites { get; set; }
        public virtual ICollection<Review> Reviews { get; set; }
        public virtual ICollection<Watchlist> Watchlists { get; set; }

        public virtual ICollection<Actor> Actors { get; set; }
        public virtual ICollection<Director> Directors { get; set; }
        public virtual ICollection<Genre> Genres { get; set; }
    }
}
