namespace vueWithJWT.DB
{
    using System.Data.Entity;

    public partial class FlashCardManagement : DbContext
    {
        public FlashCardManagement()
            : base("name=FlashCardManagement")
        {
            Configuration.AutoDetectChangesEnabled = true;
        }

        public virtual DbSet<FlashCard> FlashCards { get; set; }
        public virtual DbSet<Topic> Topics { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .Property(e => e.refreshToken)
                .IsFixedLength();
        }
    }
}
