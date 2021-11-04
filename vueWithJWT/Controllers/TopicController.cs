using System.Linq;
using System.Net;
using System.Web.Http;
using vueWithJWT.Repository;

namespace vueWithJWT.Controllers
{
    [AllowAnonymous]
    public class TopicController : ApiController
    {
        private UnitOfWork unitOfWork = new UnitOfWork();

        [HttpGet]
        [Route("api/Topics")]
        public IHttpActionResult Topics()
        {
            //var topics = unitOfWork.TopicRespository.Get("topicID");
            //var topics = unitOfWork.TopicRespository.dbset.Include("FlashCards").ToList(); chay OK

            //var topics = unitOfWork.TopicRespository.Get("FlashCards"); Ok

            var getCurrUserID = unitOfWork.UserRespository.GetbyID(4);
            var topics = unitOfWork.TopicRespository.dbset.Where(t => t.userID == 4).ToList();

            //var res = unitOfWork.TopicRespository.GetAll("FlashCards").Skip().Take(2).ToList();

            var topic = unitOfWork.TopicRespository.dbset.Where(t => t.userID == 4).ToList();

            return Content(HttpStatusCode.OK, topics);
        }
    }
}
