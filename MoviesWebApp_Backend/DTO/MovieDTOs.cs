using Org.BouncyCastle.Asn1.Mozilla;

namespace dbms.DTO
{
    public class MovieDTOs
    {
        public class MoviePropDto
        {
            public int MovieId { get; set; }
            public int UserId { get; set; }
            public string? ReviewText { get; set; }
            public int? Rating { get; set; }  
            public DateOnly? ReviewDate { get; set; }   
        }

        public class UserMovieDto
        {
            public int UserId { get; set; }
            public int MovieId { get; set; }
        }
    }
}
