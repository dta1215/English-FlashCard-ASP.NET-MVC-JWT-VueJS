using System.Web.Mvc;

namespace vueWithJWT.Controllers
{
    public class HomeController : Controller
    {
        [AllowAnonymous]
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }

        [Authorize]
        public JsonResult Test()
        {
            var see = HttpContext;
            return Json("", JsonRequestBehavior.AllowGet);
        }
    }


}
