
const listTopicTemplate = `
    <div>
        <div class="topicsArea" >
            <div v-for="(topic) in Topics" class="contentArea">
                <span class="flashCard-dot"></span>
                <img class="homeIMG" :src="topic.image" :alt="topic.topicName" >
                <h4 class="">
                    <router-link v-if="topic.FlashCards.length > 0" class="playFlashCard" :to="{name: 'Play', params: {id: topic.topicID}}" >{{topic.topicName}}</router-link>
                </h4>
            </div>
        </div>
    </div>
`

const ListTopicPattern = {
    props: ["Topics"],
    template: listTopicTemplate,
    mounted: async function () {
        console.log(this)
    }
}