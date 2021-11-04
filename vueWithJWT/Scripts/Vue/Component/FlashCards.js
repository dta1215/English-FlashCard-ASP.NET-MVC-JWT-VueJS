const flashCardsTemplate = `
    <div class="vueTopicContainer">
        <div class="headerPage">
            <p><router-link to="/Home">Home</router-link> >  
                <router-link to="/Topic">Topic</router-link> >
                {{topic.topicName}}
            </p>
            <h2 class="titlePage">{{topic.topicName}}</h2>
        </div>
        
        <div style="padding: 5px;">
            <button @click="() => {isCreateFormActive = !isCreateFormActive}" class="btn btn-primary float-right">+ More FlashCard</button>
            <div v-if="isCreateFormActive">
                <hr/>
                <dl class="dl-horizontal">
                    <dt></dt>
                    <dd><span v-if="state.invalid" class="alertError">Invalid, please check again.</span></dd>
                    <dt></dt>
                    <dd>
                        <img  :src="FlashCard.Content" :alt="FlashCard.Vocabulary" width=20% />
                    </dd>
                    <dt>Image</dt>
                    <dd>
                        <input class="form-control" type="text" v-model="FlashCard.Content" >
                        <button @click="$('.localImgFile').click()" class="btn btn-sm btn-primary">Upload</button>
                        <input @change="loadLocalImage" class="localImgFile" type="file" style="display: none" />
                    </dd>
                    <div class="hSpace"></div>
                    <dt>Title</dt>
                    <dd><input class="form-control" type="text" v-model="FlashCard.Title" /></dd>
                    <div class="hSpace"></div>
                    <dt>Vocabulary</dt>
                    <dd><input class="form-control" type="text" v-model="FlashCard.Vocabulary" /></dd>
                    <div class="hSpace"></div>
                    <dt></dt>
                    <dd><button @click="newFlashCard" class="btn btn-danger">New FlashCard</button></dd>
                </dl>
                <hr/>
            </div>
        </div>
        <div class="">
                <table class="table table-responsive table-hover table-striped ">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Content</th>
                        <th>Title</th>
                        <th>Vocabulary</th>
                        <th>Control</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(FlashCard, i) in flashCards" @click="edit(FlashCard, $event)">
                        <td>{{++i}}</td>                        
                        <td><img class="imgTable" :src="FlashCard.Content" :alt="FlashCard.Vocabulary" width=6%></td>
                        <td>{{FlashCard.Title}}</td>
                        <td>{{FlashCard.Vocabulary}}</td>
                        <td>
                            <i @click="btndeleteFlashCard(FlashCard, $event)" class="fas fa-trash"></i>
                        </td> 
                    </tr>
                </tbody>
            </table>
        </div>
    
        <div v-if="openEditModal" class="editArea">
            <div class="editModal">
                <h3 class="modalTitle" >Edit FlashCard</h3>
                <dl v-if="editFlashCard.Vocabulary.length > 0" class="dl-horizontal">
                    <dt></dt>
                    <dd>
                        <span v-if="state.invalidUpdate" class="alertError">Invalid, please check again.</span>
                    </dd>
                    <dt></dt>
                    <dd><img :src="editFlashCard.Content" :alt="editFlashCard.Vocabulary" width="70%"></dd>
                    <dt>Image</dt>
                    <dd>
                        <input class="form-control" type="text" v-model="editFlashCard.Content" >
                        <button @click="$('.localEditImageFile').click()" class="btn btn-sm btn-primary">Upload</button>
                        <input @change="updateEditFlashCardImage" class="localEditImageFile" type="file" style="display: none" />
                    </dd>
                    <dt>Title</dt>
                    <dd><input class="form-control" type="text" v-model="editFlashCard.Title" /></dd>
                    <dt>Vocabulary</dt>
                    <dd><input class="form-control" type="text" v-model="editFlashCard.Vocabulary" /></dd>
                    <hr/>
                </dl>
                <div class="modalControl">
                    <button @click="openEditModal = !openEditModal" class="btn">Close</button>
                    <button @click="updateFlashCard" class="btn btn-danger">Update</button>
                </div>
            </div>
        </div>    

        <div v-if="openUploadImage" class="uploadImageArea">
            <div class="mainModel">
                <h4>UpLoad Image</h4>
                <input id="uploadByLocal" @change="fileChange" type="file" style="display:none" />
                <input @dblclick="uploadByLocal" type="text" v-model="imageSrc" v-model="imageEditSrc" />
            </div>
            <br>
            <button @click="openUploadImage = !openUploadImage" class="btn btn-sm">Close</button>
        </div>
    </div>
`


const FlashCards = {
    template: flashCardsTemplate,
    data() {
        return {
            flashCards: [],
            FlashCard: {
                FlashCardID: "",
                Title: "",
                Content: "",
                Vocabulary: "",
                topicID: ""
            },
            topic: {
                topicID: "",
                topicName: "",
            },
            editFlashCard: {
                FlashCardID: "",
                Title: "",
                Content: "",
                Vocabulary: "",
            },
            isCreateFormActive: false,
            openUploadImage: false,
            imageSrc: "",
            imageEditSrc: "",
            openEditModal: false,
            state: {
                invalid: false,
                invalidUpdate: false,
            }
        }
    },
    methods: {
        edit(flashcard, e) {
            this.editFlashCard = flashcard
            this.openEditModal = !this.openEditModal
        },
        loadLocalImage(e) {
            const file = e.target.files[0]
            const getSrc = URL.createObjectURL(file)
            this.FlashCard.Content = getSrc
        },
        updateEditFlashCardImage(e) {
            const file = e.target.files[0]
            const getSrc = URL.createObjectURL(file)
            this.editFlashCard.Content = getSrc
        },
        async newFlashCard() {
            this.FlashCard.topicID = this.topic.topicID
            const newFlashCard = this.FlashCard

            const invalidInput = newFlashCard.Title == "" || newFlashCard.Vocabulary == ""
            this.state.invalid = invalidInput
            if (invalidInput) {
                alert("Please, fill out blank!")
            } else {
                await store.dispatch('newFlashCard', {
                    FlashCard: newFlashCard
                }).then(async (res) => {
                    await store.dispatch('getFlashCards', this.$route.params.id).then((result) => {
                        this.flashCards = result.flashcards
                        this.topic = result.topic
                    })
                })
            }
        },
        async btndeleteFlashCard(flashCard, e) {
            e.stopPropagation()
            const allowRemove = confirm(`Confirm remove Flash Card: ${flashCard.Vocabulary} ?`)
            if (allowRemove) {
                await store.dispatch('deleteFlashCard', flashCard.FlashCardID).then(() => {
                    this.loadFlashCards()
                })
            }
        },
        async updateFlashCard() {
            const editFlashCard = this.editFlashCard
            const invalidInput = editFlashCard.Title == "" || editFlashCard.Vocabulary == ""
            this.state.invalidUpdate = invalidInput
            if (invalidInput) {
                alert("Please, fill out blank!")
            } else {
                await store.dispatch('updateFlashCard', this.editFlashCard).then(async () => {
                    window.location.reload()
                })
            }
        },
        async loadFlashCards() {
            const res = await store.dispatch('getFlashCards', this.$route.params.id).then((result) => {
                this.flashCards = result.flashcards
                this.topic = result.topic
            })
        }
    },
    mounted: async function () {
        this.loadFlashCards()
    }
}