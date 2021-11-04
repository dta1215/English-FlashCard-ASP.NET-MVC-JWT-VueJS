const registerTemplate = `
<div class="loginBG">
    <div class="LoginArea">
        <h1 style="text-align:center;">Register</h1>
        <div class="registerArea">
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
            <div class="space"></div>
            <a class="btnCancle" href="/#/Login">Cancle</a>
        </div>
    </div>
</div>
`

const Register = {
    template: registerTemplate,
    data() {
        return {
            userRegister: {
                password: "",
                userName: "",
                email: "",
                retypePassword:""
            },
            state: {
                registerFail: false
            }
        }
    },
    methods: {
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

                this.postRegister(model)
            } else {
                //alert("Please, check your fill out again!")
            }
        },
        async postRegister(user) {
            try {
                const res = await $.post(`/api/register`, user)
                window.location.href = "/Login"
            } catch (err) {
                alert(err)
            }
        },
        changeBackground() {
            if (this.$route.name == "Register") {
                $('.vueContainer').addClass('changeBG')
                $('.LoginArea').css("background", "#fcfcfc")
            }
        }
    },
    mounted: async function () {
        this.changeBackground()
    }
}