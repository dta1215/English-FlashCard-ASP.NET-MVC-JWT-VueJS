const headerTemplate = `
    <div class="header">
        <div class="headerBox">
            <div class="logo">Quiz FlashCard</div>
            <div v-if="userID" class="mainNavigatior">
                <router-link class="hrefNavigator" to="/Home">Home</router-link>
                <router-link class="hrefNavigator" to="/Topic">Topic</router-link>
                <router-link class="hrefNavigator" to="/Share">Topics Shared</router-link>
            </div>
            <div class="searchForm">
                <input class="searchInput" type="text" v-model="search.valueSearch">
                <a @click="SearchHanler" class="btnSearch"><i class="fas fa-search"></i></a>
            </div>
            <div class="loginArea" style="color: white;">
                <router-link v-if="user.userName" class="currUserName hrefNavigator" to="/Profile">{{user.userName}}</router-link>
                <div class="space"></div>                
                <a @click="logOutAction" v-if="user.userName" class="hrefNavigator" href="/" >Log out</a>
                <router-link v-if="!user.userName" class="hrefNavigator" to="/Login">Login</router-link>
            </div>
        </div>

        <div class="responsiveHeader">
            <div class="btnNavMenu"><i class=" fas fa-bars "></i></div>
            <div class="logo-mobile">Quiz FlashCard</div>
            <div class="searchForm">
                <input class="searchInput" type="text" v-model="search.valueSearch">
                <a @click="SearchHanler" class="btnSearch"><i class="fas fa-search"></i></a>
            </div>
            <div class="mobile-Header">
                <router-link v-if="user.userName" class="currUserName hrefNavigator" to="/Profile">{{user.userName}}</router-link>
                <a  v-if="user.userName" class="mobile-control" href="/#/Home">Home</a>
                <a  v-if="user.userName" class="mobile-control" href="/#/Topic">Topic</a>
                <a  v-if="user.userName" class="mobile-control" href="/#/Share">Topics Shared</a>
                <a v-if="user.userName" @click="logOutAction"  class="mobile-control" href="/" >Log out</a>
                <a v-if="!user.userName" class="mobile-control" href="/#/Login">Login</a>
            </div>
        </div>
    </div>
`



const Header = {
    props: ["isLogin", "user"],
    template: headerTemplate,
    data() {
        return {
            userID: "",
            user: {},
            search: {
                valueSearch: "",
            }
        }
    },
    methods: {
        async logOutAction() {
            this.userID = null
            window.localStorage.clear()
        },
        toggleMobileHeader() {
            const mobileHeader = document.querySelector(".mobile-Header")
            const btnNavMenu = document.querySelector(".btnNavMenu")

            btnNavMenu.onclick = (e) => {
                e.stopImmediatePropagation()
                mobileHeader.classList.toggle("active")
            }
            $(document).click((e) => {
                const isNavMenu = e.target.classList.contains('active')
                if (!isNavMenu) {
                    mobileHeader.classList.remove('active')
                }
            })
        },
        async SearchHanler() {
            if (this.search.valueSearch) {
                try {
                    this.$router.push({ name: "Home" })
                    setTimeout(async () => {
                        this.$router.push({ name: "Search", params: { valueSearch: this.search.valueSearch, userID: this.userID } })
                    }, 1)
                } catch (err) { }
            } else {
                alert("Please, fill in the blank!")
            }
        }
    },
    mounted: async function () {
        this.userID = getUserIDStorage()
        this.toggleMobileHeader()
    }
}