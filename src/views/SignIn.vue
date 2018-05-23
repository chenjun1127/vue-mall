<template lang="jade">
    .login_register
        .loginTips.alert.alert-danger(v-show="isLoginTips") 当前账号无权限，请联系管理员！
        .row
            .col-md-12
                .form-horizontal
                    .form-group
                        .col-md-9.col-md-offset-3
                            div.register 还没有账号，去<router-link class='link' to="/signUp">注册</router-link>吧！
                    .form-group
                        label.col-md-3.control-label 用户名
                        .col-md-9.verifyHeight
                            input.form-control(type="text", v-model="userInfo.name",v-verify="userInfo.name")
                            p.verify-error-msg(v-remind="userInfo.name")
                    .form-group
                        label.col-md-3.control-label 密码
                        .col-md-9.verifyHeight
                            input.form-control(type="password", v-model="userInfo.password",v-verify="userInfo.password")
                            p.verify-error-msg(v-remind="userInfo.password")
                    .form-group
                        .col-md-6.col-md-offset-3
                            button.btn.btn-danger(type="button",@click="toLogin") 登录
                        .col-md-3.forgetMiMa
                            router-link(to="/user/password").btn.btn-link.link 忘记了密码？
                    .form-group(v-show="error.show")
                        .col-md-9.col-md-offset-3
                            span.error {{error.msg}}
</template>

<script>
    import Header from '../components/Header';
    import axios from 'axios';

    export default {
        name: "SignIn",
        data() {
            return {
                userInfo: {
                    name: '',
                    password: '',
                },
                error: {
                    show: false,
                    msg: ''
                },
                isLoginTips: false,
            }
        },
        verify: {
            userInfo: {
                name: ['required', 'username'],
                password: ['required', 'password'],
            }
        },
        mounted() {
            if (this.$route.query.redirect) {
                this.isLoginTips = true;
            }
        },
        methods: {
            toLogin() {
                if (this.$verify.check()) {
                    axios.post('/api/users/login', this.userInfo).then(res => {
                        if (res.data.code === 200) {
                            this.isLogin = true;
                            this.$store.dispatch('updateActionsUser', Object.assign({}, res.data.data, {isLogin: true}));
                            sessionStorage.setItem('id', res.data.data._id);
                            sessionStorage.setItem('role', res.data.data.role);
                            this.$router.push({path: '/'});
                        } else {
                            this.error.show = true;
                            this.error.msg = res.data.desc;
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                }
            }
        },
        components: {Header}
    }
</script>

<style scoped>
    .login_register {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: auto;
        width: 550px;
        box-shadow: 0 0 3px #adadad;
        border-radius: 5px;
        padding: 30px;
    }

    .forgetMiMa {
        text-align: right;
        padding-right: 0;
    }

    .loginTips {
        position: absolute;
        left: 0;
        top: -70px;
        width: 100%;
    }

    .error {
        color: #d9534f;
    }

    .register {
        text-align: right;
    }

    a.col-md-9.verifyHeight {
        color: #e4393c;

    }

    a.link:hover {
        color: #b32b2e
    }
</style>
