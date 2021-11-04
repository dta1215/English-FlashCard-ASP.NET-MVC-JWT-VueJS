using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using vueWithJWT.DB;
using vueWithJWT.Repository;

namespace vueWithJWT.Controllers
{
    [Authorize]
    public class userRespoController : ApiController
    {
        private FlashCardManagement db = new FlashCardManagement();
        private readonly UnitOfWork unitOfWork = new UnitOfWork();
        private readonly int number_Page = 12;

        [AllowAnonymous]
        [HttpPost]
        [Route("api/register")]
        public IHttpActionResult register(User user)
        {
            try
            {
                db.Users.Add(user);
                db.SaveChanges();

                return Content(HttpStatusCode.OK, "");
            }
            catch (Exception err)
            {
                return Content(HttpStatusCode.OK, err);
            }
        }

        [HttpGet]
        [Route("api/user/{userID}")]
        public User user(int userID)
        {
            var res = unitOfWork.UserRespository.dbset.Find(userID);
            return new User
            {
                userID = res.userID,
                userName = res.userName,
                avatarSrc = res.avatarSrc,
                email = res.email,
                lastVisitDate = res.lastVisitDate,
                role = res.role
            };
        }
        [HttpGet]
        [Route("api/userRole/{userID}")]
        public User userRole(int userID)
        {
            var res = unitOfWork.UserRespository.dbset.Find(userID);
            return new User
            {
                userName = res.userName,
                role = res.role
            };
        }

        [HttpPost]
        [Route("api/changePassword/{userID}")]
        public IHttpActionResult changePassword(int userID, User user)
        {
            var oldUser = unitOfWork.UserRespository.dbset.Find(userID);

            oldUser.password = user.password;
            unitOfWork.Save();

            return Content(HttpStatusCode.OK, "OK");
        }


        [HttpGet]
        [Route("api/playTopic/{topicID}")]
        public IHttpActionResult playTopic(int topicID)
        {
            //var playTopic = db.Topics.Find(topicID);
            //return Content(HttpStatusCode.OK, new Topic
            //{
            //    topicID = playTopic.topicID,
            //    topicName = playTopic.topicName,
            //    FlashCards = playTopic.FlashCards,
            //    image = playTopic.image,
            //    share = playTopic.share
            //});

            //USE unitofwork
            var playTopic = unitOfWork.TopicRespository.dbset.Find(topicID);
            return Content(HttpStatusCode.OK, new Topic
            {
                topicID = playTopic.topicID,
                topicName = playTopic.topicName,
                FlashCards = playTopic.FlashCards,
                image = playTopic.image,
                share = playTopic.share
            });
        }

        [HttpGet]
        [Route("api/topics/{userID}")]
        public IHttpActionResult topics(int userID, int page)
        {
            //var user = db.Topics.Where(u => u.userID == userID).OrderBy(u => u.topicID).Skip((page - 1) * number_Page).Take(number_Page).ToList();
            //return Content(HttpStatusCode.OK, user);
            //USE unitofwork

            var user = unitOfWork.TopicRespository.dbset.Where(u => u.userID == userID).OrderBy(u => u.topicID).Skip((page - 1) * number_Page).Take(number_Page).ToList();
            return Content(HttpStatusCode.OK, user);
        }

        [HttpGet]
        [Route("api/topic/update/{topicID}")]
        public IHttpActionResult topicUpdate(int topicID, string topicName)
        {
            //var topic = db.Topics.FirstOrDefault(t => t.topicID == topicID);
            //topic.topicName = topicName;
            //db.SaveChanges();

            var topic = unitOfWork.TopicRespository.dbset.FirstOrDefault(t => t.topicID == topicID);
            topic.topicName = topicName;
            unitOfWork.Save();

            return Content(HttpStatusCode.OK, topicName);
        }

        [HttpPost]
        [Route("api/createTopic/{userID}/{topicName}")]
        public IHttpActionResult createTopic(int userID, string topicName)
        {
            Topic topic = new Topic();
            topic.topicName = topicName;
            topic.userID = userID;

            //db.Topics.Add(topic);
            //db.SaveChanges();

            unitOfWork.TopicRespository.dbset.Add(topic);
            unitOfWork.Save();

            return Content(HttpStatusCode.OK, topicName);
        }

        [HttpPost]
        [Route("api/newTopic/{userID}")]
        public IHttpActionResult newTopic(int userID, Topic topic)
        {
            topic.userID = userID;

            //db.Topics.Add(topic);
            //db.SaveChanges();

            unitOfWork.TopicRespository.dbset.Add(topic);
            unitOfWork.Save();

            return Ok();
        }

        [HttpPost]
        [Route("api/updateTopic/{topicID}")]
        public IHttpActionResult updateTopic(int topicID, Topic topic)
        {
            //var oldTopic = db.Topics.Find(topicID);

            var oldTopic = unitOfWork.TopicRespository.dbset.Find(topicID);
            oldTopic.topicName = topic.topicName;
            oldTopic.image = topic.image;
            oldTopic.share = topic.share;

            //db.SaveChanges();
            unitOfWork.Save();

            return Ok();
        }

        [HttpGet]
        [Route("api/deleteTopic/{topicID}")]
        public IHttpActionResult deleteTopic(int topicID)
        {
            //var topic = db.Topics.Find(topicID);
            //db.Topics.Remove(topic);
            //db.SaveChanges();

            var topic = unitOfWork.TopicRespository.dbset.Find(topicID);
            unitOfWork.TopicRespository.dbset.Remove(topic);
            unitOfWork.Save();

            return Ok();
        }

        [HttpGet]
        [Route("api/flashcards/{topicID}")]
        public IHttpActionResult getFlashCards(int topicID)
        {
            var topic = db.Topics.Find(topicID);
            var flashcards = db.FlashCards.Where(f => f.topicID == topicID).ToList();
            return Content(HttpStatusCode.OK, new
            {
                topic = new
                {
                    topicName = topic.topicName,
                    topicID = topic.topicID
                },
                flashcards = flashcards
            });
        }

        [HttpPost]
        [Route("api/newFlashCard/{topicID}")]
        public IHttpActionResult newFlashCard(int topicID, FlashCard flashCard)
        {
            FlashCard newFlashCard = new FlashCard();
            newFlashCard.Content = flashCard.Content;
            newFlashCard.Title = flashCard.Title;
            newFlashCard.Vocabulary = flashCard.Vocabulary;
            newFlashCard.topicID = flashCard.topicID;

            db.FlashCards.Add(newFlashCard);
            db.SaveChanges();

            return Content(HttpStatusCode.OK, "");
        }

        [HttpGet]
        [Route("api/deleteFlashCard/{FlashCardID}")]
        public IHttpActionResult deleteFlashCard(int FlashCardID)
        {
            var flashCard = unitOfWork.FlashCardRespository.dbset.Find(FlashCardID);

            unitOfWork.FlashCardRespository.dbset.Remove(flashCard);
            unitOfWork.Save();

            return Ok();
        }

        [HttpPost]
        [Route("api/updateFlashCard/{FlashCardID}")]
        public IHttpActionResult updateFlashCard(int FlashCardID, FlashCard flashCard)
        {
            var oldFlashCard = unitOfWork.FlashCardRespository.dbset.Find(FlashCardID);
            oldFlashCard.Title = flashCard.Title;
            oldFlashCard.Content = flashCard.Content;
            oldFlashCard.Vocabulary = flashCard.Vocabulary;

            unitOfWork.Save();
            return Ok();
        }

        //#share
        [HttpGet]
        [Route("api/share")]
        public IEnumerable<Topic> share()
        {
            var res = db.Topics.AsNoTracking().Where(t => t.share == true).ToList();

            return res;
        }

        [HttpPost]
        [Route("api/search/{userID}/{search}")]
        public IHttpActionResult search(int userID, string search)
        {
            var res = unitOfWork.TopicRespository.dbset
                                .AsNoTracking() 
                                .Where(t=>t.userID == userID)
                                .Where(t => t.topicName.ToLower().Contains(search.ToLower())).ToList();
            return Content(HttpStatusCode.OK, res);
        }

        
    }
}
