using System;
using vueWithJWT.DB;

namespace vueWithJWT.Repository
{
    public class UnitOfWork : IDisposable
    {
        private FlashCardManagement context = new FlashCardManagement();
        private GenericRespository<User> userRespo;
        private GenericRespository<Topic> topicRespo;
        private GenericRespository<FlashCard> flashcardRespo;

        public GenericRespository<User> UserRespository
        {
            get
            {
                if (this.userRespo == null)
                {
                    this.userRespo = new GenericRespository<User>(context);
                }
                return userRespo;
            }
        }
        public GenericRespository<Topic> TopicRespository
        {
            get
            {
                if (this.topicRespo == null)
                {
                    this.topicRespo = new GenericRespository<Topic>(context);
                }
                return topicRespo;
            }
        }
        public GenericRespository<FlashCard> FlashCardRespository
        {
            get
            {
                if (this.flashcardRespo == null)
                {
                    this.flashcardRespo = new GenericRespository<FlashCard>(context);
                }
                return flashcardRespo;
            }
        }
        public void Save()
        {
            context.SaveChanges();
        }
        private bool disposed = false;
        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}