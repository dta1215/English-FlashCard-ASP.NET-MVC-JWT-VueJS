
const topicsTemplate = `
    <div class="vueTopicContainer">
        <div class="headerPage">
            <p><router-link to="/Home">Home</router-link> >
                Topic
            </p>
            <h2 class="titlePage">Topic Management</h2>
        </div>
        <div style="padding: 5px;" class="createFormArea">
            <button @click="() => {isCreateFormActive = !isCreateFormActive}" class="btn btn-primary">+ More Topic</button>
            <div v-if="isCreateFormActive">
                <hr/>
                <dl class="dl-horizontal">
                    <dt>Image</dt>
                    <dd>
                        <input class="form-control" type="text" v-model="createTopic.image" >
                        <button @click="$('.localImgFile').click()" class="btn btn-sm btn-primary">Upload</button>
                        <input @change="loadLocalImage" class="localImgFile" type="file" style="display: none" />
                    </dd>
                    <dt>Topic name</dt>
                    <dd><input class="form-control" type="text" v-model="createTopic.topicName" /></dd>
                    <dt>Share</dt>
                    <dd><input type="checkbox" v-model="createTopic.share" /></dd>
                    <dt></dt>
                    <dd><button @click="newTopicAction" class="btn btn-danger">New Topic</button></dd>
                </dl>
                <hr/>
            </div>
        </div>
        <hr/>
        <div style="padding: 5px;" class="filterArea">
            <select class="form-control" @change="filterAction" v-model="filterOption">
                <option value="" selected hidden>Open this select menu</option>
                <option value="topicname">Topic name</option>
                <option value="share">Share</option>
                <option value="flashcard">FlashCards</option>
            </select>
        </div>
        <div class="">
            <div>
                <table class="table table-responsive table-hover table-striped">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Image</th>
                            <th>Topic name</th>
                            <th>Share</th>
                            <th>FlashCards</th>
                            <th>Control</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(topic,i) in topics" @click="viewTopic(topic, $event)">
                            <td>{{++i}}</td>                        
                            <td v-if="topic.FlashCards.length > 0" >
                                <router-link  class="playFlashCard" :to="{name: 'Play', params: {id: topic.topicID}}" ><img class="goPlay" :src="topic.image" :alt="topic.topicName" width=10%></router-link>
                            </td>
                            <td v-else >
                                <img class="goPlay" :src="topic.image" :alt="topic.topicName" width=10%>
                            </td>
                            <td title="Topic Name">{{topic.topicName}}</td>
                            <td title="Share status"><input type="checkbox" v-model="topic.share" disabled></td>
                            <td title="See Flash Cards">
                                <router-link :to="{name: 'FlashCard', params: {id: topic.topicID}}">
                                    {{topic.FlashCards.length}}
                                </router-link>
                            </td>
                            <td>
                                <i @click="btndeleteTopic(topic, $event)" class="fas fa-trash"></i>
                            </td>                            
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="loadMoreArea">
            <div v-if="isLoading" class="loadingModal">Loading...</div>
            <button v-if="!isLast"  @click="loadMore" id="btnLoadMoreHome" class="btn btn-sm btn-primary">Load more</button>
        </div>

        <div v-if="openEditModal" class="editArea">
            <div class="editModal">
                <h3 class="modalTitle" >Edit Topic</h3>
                <div class="dl-horizontal">
                    <dt></dt>
                    <dd><img  :src="previewTopic.image" :alt="previewTopic.topicName" width="50%"></dd>
                    <dt>Image</dt>
                    <dd>
                        <input class="form-control" type="text" v-model="previewTopic.image" >
                        <button @click="$('.localEditImageFile').click()" class="btn btn-sm btn-primary">Upload</button>
                        <input @change="updateEditTopicImage" class="localEditImageFile" type="file" style="display: none" />
                    </dd>
                    <dt>Name</dt>
                    <dd><input class="form-control" type="text" v-model="previewTopic.topicName" ></dd>
                    <dt>Share</dt>
                    <dd><input type="checkbox" v-model="previewTopic.share"></dd>
                        
                    <hr>
                    <dt>Flash Cards</dt>
                    <dd>
                        <ul v-if="previewTopic.FlashCards.length > 0">
                            <li v-for="flashCard in previewTopic.FlashCards">
                                <p>{{flashCard.Vocabulary}}</p>
                            </li>
                        </ul>
                    </dd>
                    <hr>
                <div>
            </div>
            <div class="modalControl">
                <button @click="openEditModal = !openEditModal" class="btn ">Close</button>
                <button @click="updateTopic" class="btn btn-danger">Update</button>
            </div>
        </div>
    </div>
`

const Topics = {
    template: topicsTemplate,
    data() {
        return {
            userID: null,
            topics: [],
            page: 1,
            isLoading: false,
            isLast: false,
            previewTopic: {
                topicID: "",
                image: "",
                topicName: "",
                share: false,
                FlashCards: []
            },
            isCreateFormActive: false,
            createTopic: {
                image: "",
                topicName: "",
                share: false,
            },
            previewFlashCards: {
                topicID: "",
                topicName: "",
                image: "",
                FlashCards: []
            },
            flashCard: {
                FlashCardID: "",
                Title: "",
                Content: "",
                Vocabulary: "",
                topicID: ""
            },
            openEditModal: false,
            openUploadImage: false,
            imageSrc: "",
            imageEditSrc: "",
            filterOption: ""
        }
    },
    methods: {
        viewTopic(topic, e) {
            e.stopPropagation()
            if (topic) {
                this.previewTopic.topicID = topic.topicID
                this.previewTopic.image = topic.image
                this.previewTopic.topicName = topic.topicName
                this.previewTopic.share = topic.share
                this.previewTopic.FlashCards = topic.FlashCards
                this.openEditModal = !this.openEditModal
            }
        },
        loadLocalImage(e) {
            const file = e.target.files[0]
            const getSrc = URL.createObjectURL(file)
            this.createTopic.image = getSrc
        },
        updateEditTopicImage(e) {
            const file = e.target.files[0]
            const getSrc = URL.createObjectURL(file)
            this.previewTopic.image = getSrc
        },
        async btndeleteTopic({ topicID, topicName}, e) {
            e.stopPropagation()
            const allowRemove = confirm(`Confirm remove topic: ${topicName} ?`)
            if (allowRemove) {
                await store.dispatch('deleteTopic', topicID).then(() => {
                    this.topics = this.topics.filter((val, i) => {
                        return val.topicID != topicID
                    })
                })
                
            }
        },
        async newTopicAction() {
            const invalidData = this.createTopic.image == "" || this.createTopic.topicName == ""
            if (invalidData) {
                alert("Please, do not leave blank !")
            } else {
                await store.dispatch('newtopic', this.createTopic).then(async (result) => {
                    window.location.reload()
                })
            }
        },
        async refreshTopic() {
            this.topics = []
            await this.loadTopics()
        },
        async updateTopic() {
            const res = await store.dispatch('updateTopic', this.previewTopic).then(async (result) => {
                this.loadTopics()
            })
        },
        async loadTopics(page = 1) {
            this.isLoading = true
            await store.dispatch('getTopics', {
                userID: this.userID,
                page: page
            }).then((result) => {
                this.isLoading = false
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
        filterAction() {
            const option = this.filterOption
            const sort = this.topics.sort((a, b) => {
                let result
                switch (option) {
                    case "topicName":
                        result = b.topicName.localeCompare(a.topicName)
                        break
                    case "share":
                        result = b.share - a.share
                        break;
                    case "flashcard":
                        result = b.FlashCards.length - a.FlashCards.length
                        break;
                    default:
                        result = -1
                }
                return result
            })
            this.topics = sort
        }
    },
    watchs: {
        "topics": function (val) {
            console.log("computed",val)
        }
    },
    mounted: async function () {
        this.userID = getUserIDStorage()

        //this.loadTopics(this.page)
        this.loadTopics()
    }
}