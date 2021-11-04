
const homeTemplate = `
    <div>
        <div @click="openTopicCategory = !openTopicCategory" class="topicCategory">
            <h3>Topic Category</h3>
            <ul v-if="openTopicCategory">
                <li v-for="(topic) in topics">{{topic.topicName}}</li>
            </ul>
        </div>
        <div class="topicsArea" >
            <div v-for="(topic) in topics" class="contentArea">
                <span class="flashCard-dot"></span>
                <img class="homeIMG" :src="topic.image" :alt="topic.topicName" >
                <h4 v-if="topic.FlashCards.length > 0" class="childbox-header1 childbox-header-light1">
                    <router-link  class="playFlashCard" :to="{name: 'Play', params: {id: topic.topicID}}" >{{topic.topicName}}</router-link>
                </h4>
                <h4 v-else class="childbox-header1 childbox-header-light1">{{topic.topicName}}</h4>
                <div>
                </div>
            </div>
        </div>
        <div class="loadMoreArea">
            <div v-if="isLoading" class="loadingModal">Loading...</div>
            <button v-if="!isLast" @click="loadMore" id="btnLoadMoreHome" class="btn btn-sm btn-primary">Load more</button>
        </div>
    </div>
`
//<router-link class="playFlashCard" :to="{name: 'Play', params: {id: topic.topicID}}" ><i class="fas fa-play"></i> Play</router-link>


const Home = {
    template: homeTemplate,
    data() {
        return {
            userID: null,
            isLast: false,
            page: 1,
            openTopicCategory: false,
            isLoading: false,
            topics: [],
            newTopic: {
                topicName: ""
            }
        }
    },
    watch: {
        'topics': function (newVal, old) {
            //console.log(newVal, old)
        }
    },
    methods: {
        async testAuthorize() {
            const token = localStorage.getItem("token")
            try {
                const res = await $.ajax({
                    url: `/Token/products`,
                    type: "GET",
                    data: null,
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            } catch (err) {
                if (err.statusText == "Unauthorized") {
                    window.localStorage.clear()
                    store.state.user.isLogin = false
                    this.$router.push({ path: '/Login' })
                }
            }
        },
        async loadTopics(page = 1) {
            this.isLoading = !this.isLoading
            await store.dispatch('getTopics', {
                userID: this.userID,
                page: page
            }).then((result) => {
                this.isLoading = !this.isLoading
                if (result.length > 0) {
                    this.topics = this.topics.concat(result)

                } else {
                    this.isLast = true
                }
            })
        },
        async loadMore() {
            this.loadTopics(++this.page)
        },
    },
    mounted: async function () {
        this.userID = getUserIDStorage()
        await this.loadTopics()
    }
}