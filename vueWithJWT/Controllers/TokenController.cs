using Microsoft.IdentityModel.Tokens;
using System;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Web.Mvc;
using vueWithJWT.DB;
using vueWithJWT.Repository;

namespace vueWithJWT.Controllers
{
    public class TokenController : Controller
    {
        // GET: Token
        private readonly FlashCardManagement db = new FlashCardManagement();

        private readonly UnitOfWork unitOfWork = new UnitOfWork();
        [AllowAnonymous]
        public JsonResult Topics()
        {
            var topics = unitOfWork.TopicRespository.dbset
                        .AsNoTracking()
                        .Include("FlashCards")
                        .Where(t => t.userID == 4).ToList();

            return Json(HttpContext.Response.StatusCode, JsonRequestBehavior.AllowGet);
        }


        [AllowAnonymous]
        public JsonResult get(string userName, string pass)
        {
            var currUser = unitOfWork.UserRespository.dbset.FirstOrDefault(u => u.userName == userName && u.password == pass);
            if (currUser != null)
            {
                var result = jwtManager.GenerateToken(currUser.userName);
                currUser.refreshToken = result.refreshToken;
                db.SaveChanges();

                return Json(new
                {
                    tokens = result,
                    userID = currUser.userID
                }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("Unauthorize", JsonRequestBehavior.AllowGet);
            }
        }


        [Authorize]
        public JsonResult products()
        {
            var res = db.Users.ToList();
            return Json(res, JsonRequestBehavior.AllowGet);
        }

        public bool checkUser(string userName, string pass)
        {
            var user = db.Users.Where(u => u.userName == userName && u.password == pass).FirstOrDefault().userName;
            if (!string.IsNullOrEmpty(user))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public JsonResult token(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(ConfigurationManager.AppSettings["Issuer"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.userName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken("uqwiyequwihqh_jq@13a2eqhwe",
                "uqwiyequwihqh_jq@13a2eqhwe",
                claims,
                expires: DateTime.Now.AddMinutes(2),
                signingCredentials: credentials
            );

            return Json(new JwtSecurityTokenHandler().WriteToken(token), JsonRequestBehavior.AllowGet);
        }

    }
}