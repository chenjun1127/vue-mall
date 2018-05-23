<template lang="jade">
    .login_register
        .row
            .col-md-12
                .form-horizontal
                    .form-group
                        .col-md-9.col-md-offset-3
                            div.register 已有账号，去<router-link class='link' to="/signIn">登录</router-link>吧！
                    .form-group
                        label.col-md-3.control-label <em>*</em> 用户名
                        .col-md-9.verifyHeight
                            input.form-control(type="text", v-model="userInfo.name",v-verify="userInfo.name")
                            p.verify-error-msg(v-remind="userInfo.name")
                    .form-group
                        label.col-md-3.control-label <em>*</em> 密码
                        .col-md-9.verifyHeight
                            input.form-control(type="password", v-model="userInfo.password",v-verify="userInfo.password")
                            p.verify-error-msg(v-remind="userInfo.password")
                    .form-group
                        label.col-md-3.control-label <em>*</em> 确认密码
                        .col-md-9.verifyHeight
                            input.form-control(type="password", v-model="userInfo.rePassword",v-verify="userInfo.rePassword")
                            p.verify-error-msg(v-remind="userInfo.rePassword")
                    .form-group
                        label.col-md-3.control-label <em>*</em> 邮箱
                        .col-md-9.verifyHeight
                            input.form-control(type="text", v-model="userInfo.email",v-verify="userInfo.email")
                            p.verify-error-msg(v-remind="userInfo.email")
                    .form-group
                        label.col-md-3.control-label <em>*</em> 手机
                        .col-md-9.verifyHeight
                            input.form-control(type="text",maxlength="11" v-model="userInfo.tel",v-verify="userInfo.tel")
                            p.verify-error-msg(v-remind="userInfo.tel")
                    .form-group
                        label.col-md-3.control-label <em>*</em> 验证码
                        .col-md-9.verifyHeight
                            input.form-control(type="text",id="userVerify" v-model="userInfo.verifyCode", v-verify="userInfo.verifyCode")
                            span#verify
                            p.verify-error-msg(v-remind="userInfo.verifyCode")
                    .form-group
                        .col-md-9.col-md-offset-3
                            div 点击注册，表示您同意本商城 《服务协议及隐私声明》
                    .form-group
                        .col-md-9.col-md-offset-3
                            button.btn.btn-danger(type="button",@click="toSignUp") 同意协议并注册
</template>

<script>
    import Header from '../components/Header';
    import GetVerify from '../utils/GetVerify';
    import axios from 'axios';

    export default {
        name: "SignUp",
        data() {
            return {
                userInfo: {
                    name: '',
                    password: '',
                    rePassword: '',
                    email: '',
                    tel: '',
                    verifyCode: '',
                },
                getVerifyCode: null,
            }
        },
        verify: {
            userInfo: {
                name: ['required', 'username'],
                password: ['required', 'password'],
                rePassword: ['required', {
                    test: function (val) {
                        return val !== this.userInfo.password ? false : true;
                    },
                    message: '密码不一致'
                }],
                email: ['required', 'email'],
                tel: ['required', 'phone'],
                verifyCode: ['required', {
                    test: function (val) {
                        return !this.getVerifyCode.validate(val) ? false : true;
                    },
                    message: '验证码错误'
                }]
            }
        },
        mounted() {
            this.getVerifyCode = new GetVerify('verify', {height: 34});
            this.getVerifyCode.GVerify();
        },
        methods: {
            toSignUp() {
                if (this.$verify.check()) {
                    const userInfoObj = this.userInfo;
                    delete userInfoObj.rePassword;
                    delete userInfoObj.verifyCode;
                    axios.post('/api/users/register', userInfoObj).then(res => {
                        if (res.data.code === 200) {
                            this.$router.push({name: 'Success', params: {msg: res.data.desc, url: '/'}});
                        } else {
                            this.$router.push({name: 'Fail', params: {msg: res.data.desc}});
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

    em {
        font-style: normal;
        font-family: "simsun";
        color: #d01a39;
        font-weight: normal;
    }

    .verifyHeight {
        position: relative;
    }

    #verify {
        width: 150px;
        height: 34px;
        position: absolute;
        right: 10px;
        top: 0;
    }

    #userVerify {
        width: 200px;
    }

    .register {
        text-align: right;
    }


</style>
