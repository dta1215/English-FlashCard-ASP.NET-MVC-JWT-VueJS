using System;
using vueWithJWT.DB;

namespace vueWithJWT.Repository
{
    public class UnitOWork : IDisposable
    {
        private readonly FlashCardManagement context = new FlashCardManagement();
        private IRespos<User> UserRespo;
        private IRespos<Topic> topicRespo;
        private IRespos<FlashCard> flashcardRespo;

        public IRespos<User> UserRespository
        {
            get
            {
                if (this.UserRespo == null)
                {
                    this.UserRespo = new IRespos<User>(context);
                }
                return this.UserRespo;
            }
        }

        public IRespos<Topic> TopicRespository
        {
            get
            {
                if (this.topicRespo == null)
                {
                    this.topicRespo = new IRespos<Topic>(context);
                }
                return this.topicRespo;
            }
        }
        public IRespos<FlashCard> FlashCardRespository
        {
            get
            {
                if (this.flashcardRespo == null)
                {
                    this.flashcardRespo = new IRespos<FlashCard>(context);
                }
                return this.flashcardRespo;
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