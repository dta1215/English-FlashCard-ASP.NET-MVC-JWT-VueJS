using System.Web.Optimization;

namespace vueWithJWT
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            //C1 select all with regex pattern
            bundles.Add(new StyleBundle("~/Scripts/vueCss").IncludeDirectory(
                "~/Scripts/Vue", "*.css" , true));
            //C2 import each css file
            //bundles.Add(new StyleBundle("~/Scripts/vueCss").Include(
            //    "~/Scripts/Vue/css/Common.css",
            //    "~/Scripts/Vue/css/Play.css",
            //    "~/Scripts/Vue/css/User.css",
            //    "~/Scripts/Vue/css/LoginRegister.css",
            //    "~/Scripts/Vue/css/Admin.css"
            //));

            bundles.Add(new Bundle("~/bundles/vueJS").Include(
                        "~/Scripts/Vue/Component/Admin/Admin.js",
                        "~/Scripts/Vue/Component/Auth/Register.js",
                        "~/Scripts/Vue/Component/Auth/Login.js",
                        "~/Scripts/Vue/Component/FlashCards.js",
                        "~/Scripts/Vue/Component/Header.js",
                        "~/Scripts/Vue/Component/ListTopicPattern.js",
                        "~/Scripts/Vue/Component/Play.js",
                        "~/Scripts/Vue/Component/Search.js",
                        "~/Scripts/Vue/Component/Share.js",
                        "~/Scripts/Vue/Component/Topics.js",
                        "~/Scripts/Vue/Component/User.js",
                        "~/Scripts/Vue/Home.js",
                        "~/Scripts/Vue/App.js"
            ));

            BundleTable.EnableOptimizations = true;

        }
    }
}
