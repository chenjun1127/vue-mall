<template>
    <div class="container">
        <h3 class="title">找回密码</h3>
        <div class="row">
            <div class="col-md-12">
                <form class="form-horizontal">
                    <div class="form-group">
                        <label class="col-md-2 control-label">请输入新密码</label>
                        <div class="col-md-10">
                            <input type="password" class="form-control" name="password" ref="password" v-model="userInfo.password" @blur="validate($event)"
                                   @focus="disappear($event)">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 control-label">确认新密码</label>
                        <div class="col-md-10">
                            <input type="password" class="form-control" name="rePassword" ref="rePassword" @blur="validate($event)" @focus="disappear($event)">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 control-label">邮箱验证码</label>
                        <div class="col-md-10">
                            <input type="text" class="form-control" name="identifyingCode" ref="identifyingCode" @blur="validate($event)" @focus="disappear($event)">
                        </div>
                    </div>
                    <div class="form-group" v-show="error.show">
                        <div class="col-md-offset-2 col-md-10 error">
                            {{error.msg}}
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-md-offset-2 col-md-10">
                            <button type="button" class="btn btn-primary" :disabled="disabled" @click="submit">确定</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'get-back',
        data() {
            return {
                msg: '',
                fail: require('../../../static/svg/fail.svg'),
                error: {
                    show: false,
                    msg: ''
                },
                disabled: true,
                userInfo: {
                    password: '',
                }
            }
        },
        methods: {
            validate(e) {
                const inputName = e.target.name;
                const value = e.target.value.trim();
                const rePsd = this.$refs.rePassword.value.trim();
                const psd = this.$refs.password.value.trim();
                const identifyingCode = this.$refs.identifyingCode.value.trim();
                if (inputName === "password") {
                    if (!/^[A-Za-z0-9]{6,16}$/.test(value)) {
                        this.error.show = true;
                        this.error.msg = '密码为字母开头，长度在6~16之间，只能包含字符、数字和下划线';
                        this.disabled = true;
                        e.target.classList.add('focus');
                    } else if (rePsd !== "" && psd !== "") {
                        this.disabled = false;
                    }
                } else if (inputName === "rePassword") {
                    if (!/^[A-Za-z0-9]{6,16}$/.test(value)) {
                        this.error.show = true;
                        this.error.msg = '密码为字母开头，长度在6~16之间，只能包含字符、数字和下划线';
                        this.disabled = true;
                        e.target.classList.add('focus');
                    } else if (psd !== "" && identifyingCode !== "") {
                        this.disabled = false;
                    }
                } else if (inputName === "identifyingCode") {
                    if (value.trim() === "") {
                        this.error.show = true;
                        this.error.msg = '验证码不能为空';
                        this.disabled = true;
                        e.target.classList.add('focus');
                    } else if (psd !== "" && rePsd !== "") {
                        this.disabled = false;
                    }
                }
            },
            disappear(e) {
                this.error.show = false;
                e.target.classList.remove('focus');
            },
            submit() {
                const psd = this.userInfo.password;
                const rePsd = this.$refs.rePassword.value.trim();
                const identifyingCode = this.$refs.identifyingCode.value.trim();
                if (psd === rePsd && identifyingCode.toUpperCase() === this.$route.params.identifyingCode.toUpperCase()) {
                    // console.log('满足条件', this.$route.params, this.userInfo.password);
                    axios.post('/api/users/savePassword', Object.assign(this.$route.params, {password: this.userInfo.password})).then(res => {
                        if (res.data.code === 200) {
                            console.log(res);
                            this.$router.push({name: 'Success', params: {msg: '保存成功，去登录吧!'}});
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                } else if (psd !== rePsd) {
                    this.error.show = true;
                    this.error.msg = '两次密码不一致';
                    this.disabled = true;
                    this.$refs.rePassword.classList.add('focus');
                } else {
                    this.error.show = true;
                    this.error.msg = '验证码不正确';
                    this.disabled = true;
                    this.$refs.identifyingCode.classList.add('focus');
                }
            }
        }
    }
</script>

<style scoped>
    .status_ok {
        width: 120px;
        margin: 0 auto;
        display: block
    }

    .title {
        border-bottom: 1px solid #d9d9d9;
        padding: 15px 0;
        margin-top: 0;
    }

    .error {
        color: #e4393c;
    }
</style>
