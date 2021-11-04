
const userTemplate = `
    <div class="vueTopicContainer">
        <h3>User Profile</h3>
        <hr />
        <div class="container container-fluid">
            <div class="row">
                <div class="col-md-2">
                    <img class="previewUserImg" :src="User.avatarSrc" alt="Avartar" />
                </div>
                <div class="col-md-8">
                    <dl class="dl-horizontal">
                        <dt>User Name</dt>
                        <dd>{{User.userName}}</dd>

                        <dt>Email</dt>
                        <dd>{{User.email}}</dd>
                    </dl>
                </div>
            </div>
            <hr>
            <h3>Change Password</h3>
            <div>
                <dl class="dl-horizontal container-fluid">
                    <dt>Old Password</dt>
                    <dd><input type="password" v-model="updateUser.oldPass"></dd>
                    <dt>New Password</dt>
                    <dd><input type="password"  v-model="updateUser.newPass" ></dd>
                    <dt>New Password again</dt>
                    <dd><input type="password"  v-model="updateUser.newPassAgain"></dd>
                    <dt></dt>
                    <dd><button @click="changePassword" class="btn btn-danger">Change</button></dd>
                </dl> 
            </div>
        </div>
    </div>
`

const User = {
    template: userTemplate,
    data() {
        return {
            User: {},
            updateUser: {
                oldPass: "",
                newPass: "",
                newPassAgain: ""
            }
        }
    },
    methods: {
        async loadUser() {
            await store.dispatch('getUser', this.User.userID).then((result) => {
                this.User = result
            })
        },
        async changePassword() {
            const invalidPass = this.updateUser.oldPass == "" || this.updateUser.newPass == ""
                                || this.updateUser.newPassAgain == ""
                || this.updateUser.newPass != this.updateUser.newPassAgain
                || this.updateUser.oldPass == this.updateUser.newPassAgain
            if (invalidPass) {
                alert("Please, check your password again, do not duplicate to old password !")
            } else {
                await store.dispatch('changePassword', {
                    User: {
                        userID: this.User.userID,
                        password: this.updateUser.newPass
                    }
                }).then((result) => {
                    alert("Update Successfully !")
                })
            }
        }
    },
    mounted: async function () {
        this.User.userID = getUserIDStorage();
        await this.loadUser()
        console.log(this.User)
    }
}