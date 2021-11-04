
const sideBarTemplate = `
    <div class="headerAdmin">
        <div @click="toggleSideBar" class="sideBarMobile">
            <i class=" fas fa-bars ">
        </div>
        <div class="sideBar">
        <h4 class="adminLogo" >
            <label style="color: white;" @click="window.location.href = '/'">Quiz FlashCard</label>
        </h4>
        <div class="breakLine"></div>
        <div class="titleMenu">Main menu</div>
        <div class="breakLine"></div>
        <div class="controls">
            <router-link class="linkToNormal" to="/Admin/Users">User management</router-link>
            <router-link class="linkToNormal" to="/Admin/Topics">Topic management</router-link>
            <router-link class="linkToNormal" to="/Admin">Other</router-link>
        </div>
        <div class="breakLine"></div>
    </div>
    </div>
    
`



const SideBar = {
    template: sideBarTemplate,
    data() {
        return {
            
        }
    },
    methods: {
        toggleSideBar() {
            $('.sideBar').toggle(200)
        }
    }
}


const TopicsTemplate = `
    <div>
        <div class="navigator">
            <a href="/#/Admin">Admin</a> > <label>Topic management</label>
        </div>
        <h2 style="text-align: center;">Topic Management</h2>
        <div class="filterArea">
            <select class="form-control" @change="filterAction" v-model="filterOption">
                <option value="" selected hidden>Open this select menu</option>
                <option value="topicname">Topic name</option>
                <option value="share">Share</option>
                <option value="flashcard">FlashCards</option>
            </select>
        </div>
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
                <tr v-for="(topic,i) in Topics" >
                    <td>{{++i}}</td>                        
                    <td v-if="topic.FlashCards.length > 0" >
                        <router-link  class="playFlashCard" :to="{name: 'Play', params: {id: topic.topicID}}" ><img class="goPlay" :src="topic.image" :alt="topic.topicName" width=10%></router-link>
                    </td>
                    <td v-else >
                        <img class="goPlay" :src="topic.image" :alt="topic.topicName" width=10%>
                    </td>
                    <td title="Topic Name">{{topic.topicName}}</td>
                    <td @click="toggleSharing({topicID: topic.topicID, share: topic.share}, $event)" title="Share status"><input type="checkbox" v-model="topic.share" ></td>
                    <td title="See Flash Cards">
                        {{topic.FlashCards.length}}
                    </td>
                    <td>
                        <i @click="btndeleteTopic(topic.topicID, $event)" class="fas fa-trash"></i>
                    </td>                            
                </tr>
            </tbody>
        </table>
    </div>
`
const topicss = {
    template: TopicsTemplate,
    data() {
        return {
            Topics: [],
            filterOption: ""
        }
    },
    methods: {
        async btndeleteTopic(topicID, e) {
            if (topicID) {
                const isConfirm = confirm("Are you sure delete this Topic?")
                if (isConfirm) {
                    await store.dispatch('adminDeleteTopic', topicID).then(async (result) => {
                        window.location.reload()
                    })
                }
            }
        },
        filterAction() {
            const option = this.filterOption
            const sort = this.Topics.sort((a, b) => {
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
            this.Topics = sort
        },
        async toggleSharing(topic, e) {
            topic.share = !topic.share
            await store.dispatch('adminToggleSharing', topic)
            
        }
    },
    mounted: async function () {
        await store.dispatch('adminTopics').then(async (result) => {
            if (Array.isArray(result)) {
                this.Topics = result
            }
        })
    }
}

const UsersTemplate = `
    <div>
        <div class="navigator">
            <a href="/#/Admin">Admin</a> > <label>User management</label>
        </div>
        <h2 style="text-align: center;">User Management</h2>
        <div class="">
            <button @click="state.openNewUser = !state.openNewUser" class="btn btn-primary">New Account</button>
            <div v-if="state.openNewUser" class="registerArea" style="display: flex;">
            <span v-if="state.registerFail" class="alertError">Invalid, check again</span>
            <input class="form-control " type="text" placeholder="User name"  v-model="userRegister.userName"/>
            <div class="space"></div>
            <input class="form-control " type="email" placeholder="Email" v-model="userRegister.email" />
            <div class="space"></div>
            <input class="form-control " type="password" placeholder="Password" v-model="userRegister.password" />
            <div class="space"></div>
            <input class="form-control " type="password" placeholder="Retype password" v-model="userRegister.retypePassword" />
            <div class="space"></div>
            <button @click="registerAction" class="btn btn-danger registerBtn">Register</button>
        </div>
        <select class="form-control" style="float: right;" @change="filterAction" v-model="filterOption">
            <option value="" selected hidden>Open this select menu</option>
            <option value="username">User name</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
        </select>
        </div>
        <table class="table table-responsive table-hover table-striped">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>User name</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Role</th>
                    <th>Control</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user,i) in Users">
                    <td>{{++i}}</td>                        
                    <td><input class="form-control" type="text" :value="user.userName" disabled/></td>
                    <td><input class="form-control" type="text" :value="user.email" disabled/></td>
                    <td><input class="form-control inputPassword" :index="i" type="password" :value="user.password" /><span @click="showOrHidePassword" class="showPassIcon">Show<span></td>
                    <td><input class="form-control" type="number" min="1" max="3" :value="user.role" /></td>
                    <td>
                        <i @click="btndeleteUser(user.userID, $event)" class="fas fa-trash"></i>
                    </td>                            
                </tr>
            </tbody>
        </table>
    </div>
`
const Users = {
    template: UsersTemplate,
    data() {
        return {
            Users: [],
            showpass: false,
            userRegister: {
                password: "",
                userName: "",
                email: "",
                retypePassword: "",
                role: "3"
            },
            state: {
                registerFail: false,
                openNewUser: false
            },
            filterOption: ""
        }
    },
    methods: {
        async btndeleteUser(userID, e) {
            let isConfirm = confirm("Are you sure delete this account?")
            if (isConfirm) {
                await store.dispatch('adminDeleteUser', userID).then(async (result) => {
                    window.location.reload()
                })
            }
        },
        showOrHidePassword(e) {
            const target = $(e.target)
            const type = target.siblings().attr("type")
            if (type == "password") {
                target.siblings().attr("type", "text")
            } else {
                target.siblings().attr("type", "password")
            }
        },
        async registerAction() {
            const regexEmail = /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/.test(this.userRegister.email)
            const invalidInput = this.userRegister.userName == ""
                || this.userRegister.email == ""
                || !regexEmail
                || this.userRegister.userName == ""
                || this.userRegister.password == ""
                || this.userRegister.retypePassword == ""
                || this.userRegister.retypePassword != this.userRegister.password
            this.state.registerFail = invalidInput

            if (!invalidInput) {
                const model = {
                    email: this.userRegister.email,
                    userName: this.userRegister.userName,
                    password: this.userRegister.password,
                    role: 3,
                }

            } else {
                alert("Please, check your fill out again!")
            }
        },
        filterAction() {
            const option = this.filterOption
            const sort = this.Users.sort((a, b) => {
                let result
                switch (option) {
                    case "username":
                        result = a.userName.localeCompare(b.userName)
                        break
                    case "email":
                        result = a.email - b.email
                        break;
                    case "role":
                        result = b.role - a.role
                        break;
                    default:
                        result = -1
                }
                return result
            })
            this.Users = sort
        }
    },
    mounted: async function () {
        await store.dispatch('adminUsers').then(async (result) => {
            if (Array.isArray(result)) {
                this.Users = result
            }
        })
    }
}

const adminTemplate = `
    <div class="adminArea">
        <Sidebar></Sidebar>
        <div class="adminMainView">
            <router-view></router-view>
        </div>
    </div>
`

const Admin = {
    template: adminTemplate,
    data() {
        return {

        }
    },
    methods: {
        changeBG() {
            $('.vueContainer').css("padding", "0")
            $('.vueContainer').css("background", "#fcfcfc")
        }
    },
    components: {
        "Sidebar": SideBar,
    },
    mounted: async function () {
        this.changeBG()
    }
}