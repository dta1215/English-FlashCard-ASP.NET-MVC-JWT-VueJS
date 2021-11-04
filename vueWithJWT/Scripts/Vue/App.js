
//{ path: '/Share/:id', name: "Share", component: Share },

function getToken() {
    const token = localStorage.getItem("token")
    return token
}
function getUserIDStorage() {
    const userID = window.localStorage.getItem("userID")
    return userID
}

const requestWithToken = async function (url, reqType = "GET", reqData = null, token = getToken()) {
    return new Promise(async (resolve, rej) => {
        try {
            const res = await $.ajax({
                url: url,
                type: reqType,
                data: reqData,
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
            resolve(res)
        } catch (err) {
            if (err) {
                window.location.href = "/Login"
            }
        }
    })

}


const store = new Vuex.Store({
    state: {
        user: {
            isLogin: false,
            userID: null,
            user: {},
            topics: {}
        },
        flashCards: []
    },
    actions: {
        getTopics(state, { userID, page }) {
            return requestWithToken(`/api/topics/${userID}`, "GET", { page: page })
        },
        getUserID() {
            return store.state.user.userID = getUserIDStorage()
        },
        getUser(state, userID) {
            return requestWithToken(`/api/user/${userID}`)
        },
        checkRole(state, userID) {
            return requestWithToken(`/api/userRole/${userID}`)
        },
        changePassword(state, { User }) {
            return requestWithToken(`/api/changePassword/${User.userID}`, "POST", User)
        },
        playTopic(state, topicID) {
            return requestWithToken(`/api/playTopic/${topicID}`)
        },
        getFlashCards(state, topicID) {
            return requestWithToken(`/api/flashcards/${topicID}`)
        },
        newtopic(state, Topic) {
            return requestWithToken(`/api/newTopic/${getUserIDStorage()}`, "POST", Topic)
        },
        updateTopic(state, Topic) {
            return requestWithToken(`/api/updateTopic/${Topic.topicID}`, "POST", Topic)
        },
        deleteTopic(state, topicID) {
            return requestWithToken(`/api/deleteTopic/${topicID}`, "GET")
        },
        newFlashCard(state, { FlashCard }) {
            return requestWithToken(`/api/newFlashCard/${FlashCard.topicID}`, "POST", FlashCard)
        },
        updateFlashCard(state, FlashCard) {
            return requestWithToken(`/api/updateFlashCard/${FlashCard.FlashCardID}`, "POST", FlashCard)
        },
        deleteFlashCard(state, FlashCardID) {
            return requestWithToken(`/api/deleteFlashCard/${FlashCardID}`, "GET")
        },
        topicShare(state) {
            return requestWithToken(`/api/share`)
        },
        search(state, search) {
            return requestWithToken(`/api/search/${search.search.userID}/${search.search.valueSearch}`, "POST")
        },
        adminTopics(state) {
            return requestWithToken(`/api/admin/topics`)
        },
        adminUsers(state) {
            return requestWithToken(`/api/admin/users`)
        },
        adminDeleteUser(state, userID) {
            return requestWithToken(`/api/admin/deleteUser/${userID}`)
        },
        adminDeleteTopic(state, topicID) {
            return requestWithToken(`/api/admin/deleteTopic/${topicID}`)
        },
        adminToggleSharing(state, topic) {
            return requestWithToken(`/api/admin/toggleSharing/${topic.topicID}/${topic.share}`)
        }

    },

})

const routes = [
    { path: '/Search', name: "Search", component: Search },
    { path: '/FlashCard/:id', name: "FlashCard", component: FlashCards },
    { path: '/Play/:id', name: "Play", component: Play },
    { path: '/Share', name: "Share", component: Share },
    { path: '/Topic', name: "Topic", component: Topics },
    { path: '/Profile', name: "Profile", component: User },
    {
        path: '/Admin', name: "Admin", component: Admin, children: [
            {
                path: 'Users',
                component: Users,
                meta: {
                    hideNavbar: true
                }
            },
            {
                path: 'Topics',
                component: topicss,
                meta: {
                    hideNavbar: true
                }
            }

        ], meta: {
            hideNavbar: true,
            requiresAuth: true,
            roles: [1, 2, 3]
        }
    },
    {
        path: '/Login', name: "Login", component: Login, meta: {
            hideNavbar: true
        }
    },
    {
        path: '/Register', name: "Register", component: Register, meta: {
            hideNavbar: true
        }
    },
    { path: '/Home', name: "Home", component: Home },
    { path: '/', component: Home }
]

const router = new VueRouter({
    routes
})

router.beforeEach(async (to, from, next) => {
    const pattern = /([aA]dmin)/g
    store.state.user.userID = getUserIDStorage()
    if (pattern.test(`${to.path}`)) {
        await store.dispatch('checkRole', store.state.user.userID).then((result) => {
            if (result.role == [1,2,3][0]) {
                next();
            } else {
                window.location.href = "/"
            }
        })
    } else {
        next()
    }
})




const appTemplate = `
    <div class="">
        <Header v-if="!$route.meta.hideNavbar" :isLogin="store.state.user.isLogin" :user="user"></Header>
        <div class="vueContainer">
            <router-view></router-view>
        </div>
    </div>
`

const app = new Vue({
    router,
    template: appTemplate,
    data() {
        return {
            isLogin: false,
            user: {}
        }
    },
    components: {
        'Header': Header
    },
    computed: {
    },
    mounted: async function () {
        if (!getToken()) {
            this.$router.push({ path: '/Login' })
        } else {
            store.state.user.userID = getUserIDStorage()
            await store.dispatch('getUser', store.state.user.userID).then((result) => {
                this.user = result
            })
        }
    }
}).$mount('#app')