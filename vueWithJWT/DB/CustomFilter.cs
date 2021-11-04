using System;
using System.IO;
using System.Web;
using System.Web.Mvc;

namespace vueWithJWT.DB
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public class CustomFilter : AuthorizeAttribute
    {
        public CustomFilter()
        {
        }
        public override void OnAuthorization(AuthorizationContext filterContext)
        {


            base.OnAuthorization(filterContext);
            filterContext.Result = new RedirectResult("~/Home/Index");
            string message = "\n" + filterContext.ActionDescriptor.ControllerDescriptor.ControllerName +
                " -> " + filterContext.ActionDescriptor.ActionName + " -> OnActionExecuting \t- " +
                DateTime.Now.ToString() + "\n";
            message += "\n" + filterContext.HttpContext.Response.StatusCode;
            LogFile(message);

        }

        private void LogFile(string data)
        {
            File.AppendAllText(HttpContext.Current.Server.MapPath("~/Data/log.txt"), data);
        }
    }
}