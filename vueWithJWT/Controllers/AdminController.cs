using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using vueWithJWT.DB;
using vueWithJWT.Repository;

namespace vueWithJWT.Controllers
{
    [Authorize]
    public class AdminController : ApiController
    {
        private readonly UnitOfWork unitOfWork = new UnitOfWork();
        [HttpGet]
        [Route("api/admin/user/{userID}")]
        public IHttpActionResult getUser(int userID)
        {
            return Ok();
        }

        [HttpGet]
        [Route("api/admin/deleteUser/{userID}")]
        public IHttpActionResult deleteUser(int userID)
        {
            var user = unitOfWork.UserRespository.GetbyID(userID);
            unitOfWork.UserRespository.dbset.Remove(user);
            unitOfWork.Save();

            return Ok();
        }

        [HttpGet]
        [Route("api/admin/users")]
        public IHttpActionResult users()
        {
            var users = unitOfWork.UserRespository.dbset.ToList();
            return Content(HttpStatusCode.OK, users);
        }

        [HttpGet]
        [Route("api/admin/topics")]
        public IHttpActionResult topics()
        {
            var topics = unitOfWork.TopicRespository.dbset.OrderBy(t => t.topicName).ToList();
            return Content(HttpStatusCode.OK, topics);
        }

        [HttpGet]
        [Route("api/admin/deleteTopic/{topicID}")]
        public IHttpActionResult deleteTopic(int topicID)
        {
            var topic = unitOfWork.UserRespository.GetbyID(topicID);
            unitOfWork.UserRespository.dbset.Remove(topic);
            unitOfWork.Save();

            return Ok();
        }

        [HttpGet]
        [Route("api/admin/toggleSharing/{topicID}/{share}")]
        public IHttpActionResult deleteTopic(int topicID, bool share)
        {
            var topic = unitOfWork.TopicRespository.GetbyID(topicID);
            topic.share = share;

            unitOfWork.Save();

            return Content(HttpStatusCode.OK, share);
        }

        

    }
}
