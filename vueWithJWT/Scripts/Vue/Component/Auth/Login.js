const loginTemplate = `
<div class="loginBG">
    <div class="LoginArea">
            <h1 style="text-align:center;">Login</h1>
            <div class="inputArea">
                <input class="form-control" type="text" placeholder="User name"  v-model="userName" />
                    <span v-if="state.loginFail" class="alertError">Invalid user name</span>
                <div class="space"></div>
                <input v-if="togglePassword" class="form-control inputPass" type="text" placeholder="Password" v-model="password" />
                <input v-else class="form-control inputPass" type="password" placeholder="Password" v-model="password" />
                    <span v-if="state.loginFail" class="alertError">Invalid password</span>
                <span class="showPassIcon" @click="togglePass"><i class="far fa-eye"></i></span>
            </div>
            <div class="space"></div>
            <button @click="login" class="btn btn-primary loginBtn">Get started</button>
            <div class="space"></div>
            <div style="text-align: center;">
                <a href="/#/Register">Register</a>
                <div>
                    <a href="#">Forget password?</a>
                </div>
            </div>
        </div>
    </div>
`

const Login = {
    template: loginTemplate,
    data() {
        return {
            userName: "",
            password: "",
            togglePassword: false,
            state: {
                countFailLogin: 0,
                loginFail: false
            }
        }
    },
    methods: {
        async login() {
            const invalidInput = this.userName == "" || this.password == "" 
                || this.userName.length < 3
                || this.password.length < 3
            this.state.loginFail = invalidInput
            if (invalidInput) {
            } else {
                const res = await $.get(`/token/get`, { userName: this.userName, pass: this.password })
                if (res != "Unauthorize") {
                    window.localStorage.setItem('token', res.tokens.token)
                    window.localStorage.setItem('userID', res.userID)
                    store.state.user.isLogin = true

                    //this.$router.push({ path: '/' })
                    window.location.href = "/"
                } else {
                    //this.state.countFailLogin++
                    //if (this.state.countFailLogin == 4) {
                    //    alert("Attention! You have 3 times to try again")
                    //}
                    //if (this.state.countFailLogin >= 7) {
                    //    alert("Waiting for 60 seconds to try again!")
                    //    $('.loginBtn').hide()
                    //    setTimeout(() => {
                    //        $('.loginBtn').show()
                    //    },60*1000)
                    //}
                }
            }
        },
        togglePass() {
            this.togglePassword = !this.togglePassword
        },
        changeBackground() {
            if (this.$route.name == "Login") {
                $('.vueContainer').addClass('changeBG')
                $('.LoginArea').css("background", "#fcfcfc")
            }
        }
    },
    mounted: function () {
        this.changeBackground()

        const checkToken = window.localStorage.getItem("token")
        if (checkToken) {
            store.state.user.isLogin = true
            window.location.href = "/"
        } else {
            window.location.href = "/#/Login"
        }
    }
}


