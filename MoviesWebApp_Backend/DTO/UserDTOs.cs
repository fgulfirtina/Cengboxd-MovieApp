namespace dbms.DTO
{
    public class UserDTOs
    {
        public class UserProfileDto
        {
            public string Email { get; set; }
        }

        public class EditProfileDto
        {
            public string Name { get; set; }
            public string Email { get; set; }
            public int? Age { get; set; }
            public string Gender { get; set; }
            public IFormFile?  ProfilePicture { get; set; } 
        }
    }
}
