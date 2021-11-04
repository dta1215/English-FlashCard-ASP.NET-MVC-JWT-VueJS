namespace vueWithJWT.DB
{
    using System;
    using System.Collections.Generic;

    public partial class Topic
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Topic()
        {
            FlashCards = new HashSet<FlashCard>();
        }

        public int topicID { get; set; }

        public string topicName { get; set; }

        public int? userID { get; set; }

        public bool? share { get; set; }

        public DateTime? createdAt { get; set; }

        public string image { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<FlashCard> FlashCards { get; set; }
    }
}
