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
                                <input type="text" class="form-control" name="userName" @blur="validate($event)" @focus="disappear" v-model="user.name" placeholder="请输入用户名">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label">邮箱</label>
                            <div class="col-md-10">
                                <input type="email" class="form-control" name="userEmail" @blur="validate($event)" @focus="disappear" v-model="user.email" placeholder="请输入邮箱">
                            </div>
                        </div>
                        <div class="form-group" v-show="error.show">
                            <div class="col-md-offset-2 col-md-10 error">
                                {{error.msg}}
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-md-offset-2 col-md-10">
                                <button type="button" @click="submit" class="btn btn-danger" :disabled="disabled">下一步</button>
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
                user: {
                    name: '',
                    email: ''
                },
                error: {
                    show: false,
                    msg: ''
                },
                disabled: true,
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

        methods: {
            validate(e) {
                let inputName = e.target.name;
                let value = e.target.value;
                if (inputName === "userName") {
                    if (!/^[a-zA-Z0-9_]{4,16}$/.test(value)) {
                        this.error.show = true;
                        this.error.msg = '用户名为4到16位（字母，数字，下划线）';
                        this.disabled = true;
                    } else {
                        if (this.user.email.trim() !== "") {
                            this.disabled = false;
                        }
                    }
                } else if (inputName === "userEmail") {
                    if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(value)) {
                        this.error.show = true;
                        this.error.msg = '邮箱输入不正确，请重新输入';
                        this.disabled = true;
                    } else {
                        if (this.user.name.trim() !== "") {
                            this.disabled = false;
                        }
                    }
                }
            },
            disappear() {
                this.error.show = false;
            },
            submit() {
                if (this.user.name !== "" && this.user.email !== "") {
                    axios.post('/api/users/getBackPassword', this.user).then(res => {
                        console.log(res);
                        if (res.data.code === 200) {
                            this.$router.push({name: 'GetBack', params: Object.assign(this.user, {identifyingCode: res.data.identifyingCode})});
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

<style scoped>
    .title {
        border-bottom: 1px solid #d9d9d9;
        padding: 15px 0;
        margin-top: 0;
    }

    .error {
        color: #e4393c;
    }
</style>
