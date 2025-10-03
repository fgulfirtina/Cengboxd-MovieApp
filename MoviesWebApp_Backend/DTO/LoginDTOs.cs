namespace dbms.DTO
{
    public class LoginDTOs
    {
        public class UserRegisterDto
        {
            public string Name { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class UserLoginDto
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

    }
}
