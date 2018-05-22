<template>
    <div>
        <Header :navBread="navBread" showSearch="showSearch"></Header>
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label class="col-md-2 control-label">用户名</label>
                            <div class="col-md-10">
                                <input type="text" class="form-control" v-model="userInfo.name" v-verify="userInfo.name" placeholder="请输入用户名">
                                <p class="verify-error-msg" v-remind="userInfo.name"></p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label">邮箱</label>
                            <div class="col-md-10">
                                <input type="email" class="form-control" v-model="userInfo.email" v-verify="userInfo.email" placeholder="请输入邮箱">
                                <p class="verify-error-msg" v-remind="userInfo.email"></p>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-md-offset-2 col-md-10">
                                <button type="button" @click="submit" class="btn btn-danger">下一步</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from '../../components/Header';
    import axios from 'axios';

    export default {
        name: "user-password",
        data() {
            return {
                userInfo: {
                    name: '',
                    email: ''
                },
                navBread: [
                    {
                        path: '/',
                        name: '首页'
                    },
                    {
                        path: '/找回密码',
                        name: '找回密码'
                    }
                ],
            }
        },
        verify: {
            userInfo: {
                name: ['required', 'username'],
                email: ['required', 'email'],
            }
        },
        methods: {
            submit() {
                if (this.$verify.check()) {
                    axios.post('/api/users/getBackPassword', this.userInfo).then(res => {
                        if (res.data.code === 200) {
                            this.$router.push({name: 'GetBack', params: Object.assign(this.userInfo, {identifyingCode: res.data.identifyingCode})});
                        } else {
                            this.$router.push({name: 'Fail', params: {msg: res.data.desc, url: '/user/password'}});
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
