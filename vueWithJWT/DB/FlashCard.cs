namespace vueWithJWT.DB
{
    public partial class FlashCard
    {
        public int FlashCardID { get; set; }

        public string Title { get; set; }

        public string Content { get; set; }

        public string Vocabulary { get; set; }

        public int? topicID { get; set; }

        //public virtual Topic Topic { get; set; }
        //public Topic Topic { get; set; }
    }
}
