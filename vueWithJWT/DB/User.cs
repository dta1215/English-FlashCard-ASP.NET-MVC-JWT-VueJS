namespace vueWithJWT.DB
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public partial class User
    {
        public int userID { get; set; }

        public string email { get; set; }

        public string password { get; set; }

        public int role { get; set; }

        public string userName { get; set; }

        public DateTime lastVisitDate { get; set; }

        public string avatarSrc { get; set; }

        [StringLength(500)]
        public string refreshToken { get; set; }
    }
}
