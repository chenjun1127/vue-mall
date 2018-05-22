<template>
    <div>
        <Header :navBread="navBread" showSearch="showSearch"></Header>
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label class="col-md-2 control-label">请输入新密码</label>
                            <div class="col-md-10">
                                <input type="password" class="form-control" v-model="userInfo.password" v-verify="userInfo.password">
                                <p class="verify-error-msg" v-remind="userInfo.password"></p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label">确认新密码</label>
                            <div class="col-md-10">
                                <input type="password" class="form-control" v-model="userInfo.rePassword" v-verify="userInfo.rePassword">
                                <p class="verify-error-msg" v-remind="userInfo.rePassword"></p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label">邮箱验证码</label>
                            <div class="col-md-10">
                                <input type="text" class="form-control" v-model="userInfo.identifyingCode" v-verify="userInfo.identifyingCode">
                                <p class="verify-error-msg" v-remind="userInfo.identifyingCode"></p>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-offset-2 col-md-10">
                                <button type="button" class="btn btn-danger" @click="submit">确定</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Header from '../../components/Header';

    export default {
        name: 'get-back',
        data() {
            return {
                userInfo: {
                    password: '',
                    rePassword: '',
                    identifyingCode: ''
                },
                navBread: [
                    {
                        path: '/',
                        name: '首页'
                    },
                    {
                        path: '/确认密码',
                        name: '确认密码'
                    }
                ],
            }
        },
        verify: {
            userInfo: {
                password: ['required', 'password'],
                rePassword: ['required', {
                    test: function (val) {
                        return val === this.userInfo.password ? true : false;
                    },
                    message: '密码不一致'
                }],
                identifyingCode: ['required', {
                    test: function (val) {
                        return val.toUpperCase() === this.$route.params.identifyingCode.toUpperCase() ? true : false;
                    },
                    message: '验证码错误'
                }]
            }
        },
        created() {
            if (!this.$route.params.identifyingCode) {
                this.$router.push('/user/password');
            }
        },
        methods: {
            submit() {
                if (this.$verify.check()) {
                    axios.post('/api/users/savePassword', Object.assign(this.$route.params, {password: this.userInfo.password})).then(res => {
                        if (res.data.code === 200) {
                            this.$router.push({name: 'Success', params: {msg: '保存成功，去登录吧!'}});
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }
            }
        },
        components: {Header}
    }
</script>

