<template>
    <div class="row">
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <div class="logo">
                        <img src="/static/svg/logo.svg">
                        <p>XX商城网</p>
                    </div>
                </div>
                <div class="col-md-4" style="padding-top: 48px;">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Search for...">
                        <span class="input-group-btn">
                            <button class="btn btn-danger" type="button"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></button>
                        </span>
                    </div>
                </div>

                <div class="col-md-4 login-box" v-if="isLogin">
                    <div class="login-title">欢迎您，
                        <router-link class="default-link" to="/user/center">{{user.name}}</router-link>
                    </div>
                    <DropDown :dropDown="dropDown" class="admin">
                        <li slot="dropLi" v-for="item in menu">
                            <router-link :to="`${item.path}`"> {{item.text}}</router-link>
                        </li>
                    </DropDown>
                    <a href="javascript:void(0)" @click="toLogout" class="btn btn-danger">注销</a>
                </div>
                <div class="col-md-4 login-register" style="padding-top: 48px;" v-else>
                    <a href="javascript:void(0)" @click="toLogin" class="btn btn-default">登录</a>
                    <a href="javascript:void(0)" @click="toRegister" class="btn btn-danger" style="margin-left: 10px;">注册</a>
                </div>
            </div>
        </div>
        <nav class="navbar navbar-default navbar-custom " role="navigation">
            <div class="container">
                <ul class="nav navbar-nav">
                    <li>
                        <router-link :to="{path:'/'}"> 首页</router-link>
                    </li>
                </ul>
            </div>
        </nav>
        <Modal :modal="modal">
            <div slot="content" :id="id">
                <div class="form-group">
                    <label for="userName">用户名</label>
                    <input type="text" class="form-control" id="userName" @blur="validate($event)" @focus="disappear($event)" placeholder="请输入用户名" v-model="user.name">
                </div>
                <div class="form-group">
                    <label for="userPassword">密码</label>
                    <input type="password" class="form-control" id="userPassword" @blur="validate($event)" @focus="disappear($event)" placeholder="请输入密码"
                           v-model="user.password">
                </div>
                <div class="form-group" ref="userEmail" style="display:none;">
                    <label for="userEmail">邮箱</label>
                    <input type="email" class="form-control" id="userEmail" @blur="validate($event)" @focus="disappear($event)" placeholder="请输入邮箱" v-model="user.email">
                </div>
                <div class="error" v-show="error.show">{{error.msg}}</div>
            </div>
            <div slot="footer" class="footer">
                <a href="javascript:void(0)" @click="toPassword" class="default-link" ref="forget">忘记密码？</a>
                <div class="btns">
                    <button class="btn btn-default" @click="cancel">取消</button>
                    <button class="btn btn-danger" @click="enter" :disabled="disabled">确定</button>
                </div>
            </div>
        </Modal>
    </div>

</template>

<script>
    import DropDown from './DropDown';
    import Modal from './Modal';
    import axios from 'axios';
    import * as utils from '../utils/utils';

    export default {
        name: 'Header',
        data() {
            return {
                menu: [
                    {
                        'text': '首页',
                        'path': '/',
                    },
                    {
                        'text': '所有商品',
                        'path': '/product/all',
                    },
                    {
                        'text': '商品列表',
                        'path': '/product/list',
                    },
                    {
                        'text': '商品录入',
                        'path': '/product/save',
                    },
                    {
                        'text': '新增分类',
                        'path': '/category/add',
                    },

                ],
                dropDown: {
                    title: '后台管理',
                    position: 'right'
                },
                isLogin: false,
                id: '',
                modal: {
                    show: false,
                    title: '',
                    style: {
                        width: '600px',
                    }
                },
                user: {
                    name: '',
                    password: '',
                    email: ''
                },
                error: {
                    show: false,
                    msg: ''
                },
                disabled: true
            }
        },
        mounted() {
            axios.get('/api/users/session?t=' + Date.now()).then(res => {
                if (res.data.code === 200) {
                    this.isLogin = true;
                    this.user.name = res.data.data.name;
                }
            }).catch(err => {
                console.log(err);
            })
        },
        methods: {
            toLogin() {
                this.modal.show = true;
                this.modal.title = "登录";
                this.id = "login";
                this.$refs.forget.style.visibility = "visible";
                this.$refs.userEmail.style.display = "none";
                this.user.name = '';
                this.user.password = '';
                this.disabled = true;
                this.error.show = false;
            },
            toRegister() {
                this.modal.show = true;
                this.modal.title = "注册";
                this.id = "register";
                this.$refs.forget.style.visibility = "hidden";
                this.$refs.userEmail.style.display = "block";
                this.user.name = '';
                this.user.password = '';
                this.user.email = '';
                this.disabled = true;
                this.error.show = false;
            },
            enter() {
                if (this.$refs.userEmail.style.display === "block") {
                    axios.post('/api/users/register', this.user).then(res => {
                        if (res.data.code === 200) {
                            this.$router.push('/success');
                        } else {
                            this.error.show = true;
                            this.error.msg = res.data.desc;
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                } else {
                    axios.post('/api/users/login', this.user).then(res => {
                        if (res.data.code === 200) {
                            this.modal.show = false;
                            this.isLogin = true;
                        } else {
                            this.error.show = true;
                            this.error.msg = res.data.desc;
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                }
            },
            toLogout() {
                axios.get('/api/users/logout?t=' + Date.now()).then(res => {
                    if (res.data.code === 200) {
                        this.isLogin = false;
                        this.user.name = '';
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            toPassword() {
                this.$router.push('/user/password');
            },
            cancel() {
                this.modal.show = false;
            },
            disappear(e) {
                this.error.show = false;
                e.target.classList.remove('focus');
            },
            validate(e) {
                if (e.target.parentNode.parentNode.id === "login") {
                    delete this.user.email;
                }
                let value = e.target.value;
                if (value === "") {
                    this.error.show = true;
                    this.error.msg = '不能为空，请重新输入！';
                    this.disabled = true;
                    e.target.classList.add('focus');
                } else {
                    if (e.target.id === "userName") {
                        if (!/^[a-zA-Z0-9_]{4,16}$/.test(value)) {
                            this.error.show = true;
                            this.error.msg = '用户名为4到16位（字母，数字，下划线）';
                            this.disabled = true;
                            e.target.classList.add('focus');
                        } else {
                            this.mapValidate(value);
                        }
                    } else if (e.target.id === "userPassword") {
                        if (!/^[A-Za-z0-9]{6,16}$/.test(value)) {
                            this.error.show = true;
                            this.error.msg = '密码为字母开头，长度在6~16之间，只能包含字符、数字和下划线';
                            this.disabled = true;
                            e.target.classList.add('focus');
                        } else {
                            this.mapValidate(value);
                        }
                    } else if (e.target.id === "userEmail") {
                        if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(value)) {
                            this.error.show = true;
                            this.error.msg = '邮箱格式不正确，请重新输入';
                            this.disabled = true;
                            e.target.classList.add('focus');
                        } else {
                            this.mapValidate(value);
                        }
                    }
                }
            },
            mapValidate(val) {
                let userInfo = Object.values(this.user);
                // let index = userInfo.indexOf(val);
                // userInfo.splice(index, 1);
                // 删除数组当中指定的元素
                let newArray = utils.removeByValue(userInfo, val);
                for (let i in newArray) {
                    newArray[i] === "" ? this.disabled = true : this.disabled = false;
                }
            }
        },
        components: {DropDown, Modal}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .navbar-custom {
        border-radius: 0;
        background: #e4393c;
        border: none;
    }

    .navbar-nav li a {
        color: #fff;
        font-size: 16px;
        &:hover {
            color: #333;
            background: #fff;
        }
    }

    .logo {
        padding: 20px 0;
        flex-direction: row;
        display: flex;
        align-items: center;
        img {
            width: 100px;
        }
        p {
            font-size: 32px;
            padding-top: 15px;
            color: #555;
        }
    }

    .login-register {
        display: flex;
        justify-content: flex-end;
        padding-right: 0;

    }

    .login-box {
        padding-right: 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 48px;
        .admin {
            margin: 0 10px;
        }
    }

    .default-link {
        color: #e4393c;
        &:hover {
            color: #b32b2e;
        }
    }

    .footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    .error {
        color: #e4393c;
    }
</style>
