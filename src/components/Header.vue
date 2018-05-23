<template>
    <div>
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <div class="logo">
                        <img src="/static/svg/logo.svg">
                        <p>XX商城网</p>
                    </div>
                </div>
                <div class="col-md-4" style="padding-top: 4%">
                    <div v-show="!showSearch" class="input-group">
                        <input type="text" class="form-control" v-model="searchValue" @keyup.enter="toSearch" @blur="checkValue" placeholder="Search for...">
                        <span class="input-group-btn">
                            <button class="btn btn-danger" type="button"><span @click="toSearch" class="glyphicon glyphicon-search" aria-hidden="true"></span></button>
                        </span>
                    </div>
                </div>

                <div class="col-md-4" :style="{'padding-right': 0,'padding-top': !showCart? '1.5%':'4%'}">
                    <div class="login-bar" v-if="isLogin">
                        <div class="login-title">欢迎您，
                            <router-link class="default-link" to="/user/center">{{user.name}}</router-link>
                        </div>
                        <DropDown :dropDown="dropDown" class="admin" style="margin: 0 10px;">
                            <li slot="dropLi" v-for="item in menu">
                                <router-link :to="`${item.path}`">{{item.text}}</router-link>
                            </li>
                        </DropDown>
                        <a href="javascript:void(0)" @click="toLogout" class="btn btn-danger">注销</a>
                    </div>
                    <div class="login-bar" v-else>
                        <a href="javascript:void(0)" @click="toLogin" class="btn btn-default">登录</a>
                        <a href="javascript:void(0)" @click="toRegister" class="btn btn-danger" style="margin-left: 10px;">注册</a>
                    </div>
                    <Cart v-show="!showCart"></Cart>
                </div>
            </div>
        </div>
        <!--导航-->
        <div class="bread-inner">
            <div class="container bread-inner-bar">
                <ol class="breadcrumb">
                    <li v-for="(item,$index) in navBread">
                        <template v-if="$index===navBread.length-1">{{item.name}}</template>
                        <router-link v-else :to="`${item.path}`">{{item.name}}</router-link>
                    </li>
                </ol>
            </div>
        </div>
        <!--登录或注册dialog-->
        <Modal :modal="modal">
            <div slot="content" :id="id">
                <div class="form-group">
                    <label for="userName">用户名</label>
                    <input type="text" class="form-control" id="userName" v-model="user.name" v-verify.name="user.name" placeholder="请输入用户名">
                    <p class="verify-error-msg" v-remind="user.name"></p>
                </div>
                <div class="form-group">
                    <label for="userPassword">密码</label>
                    <input type="password" class="form-control" id="userPassword" v-model="user.password" v-verify.password="user.password" placeholder="请输入密码">
                    <p class="verify-error-msg" v-remind="user.password"></p>
                </div>
                <div class="form-group" ref="userEmail" style="display:none;">
                    <label for="userEmail">邮箱</label>
                    <input type="email" class="form-control" id="userEmail" v-model="user.email" v-verify="user.email" placeholder="请输入邮箱">
                    <p class="verify-error-msg" v-remind="user.email"></p>
                </div>
                <div class="error" v-show="error.show">{{error.msg}}</div>
            </div>
            <div slot="footer" class="footer">
                <a href="javascript:void(0)" @click="toPassword" class="default-link" ref="forget">忘记密码？</a>
                <div class="btn">
                    <button class="btn btn-default" @click="cancel">取消</button>
                    <button class="btn btn-danger" @click="enter">确定</button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
    import DropDown from './DropDown';
    import Modal from './Modal';
    import Cart from './Cart';
    import axios from 'axios';

    export default {
        name: 'Header',
        data() {
            return {
                menu: [
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
                    {
                        'text': '分类列表',
                        'path': '/category/list',
                    },
                    {
                        'text': '返回首页',
                        'path': '/',
                    }
                ],
                dropDown: {
                    title: '后台管理',
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
                    email: '',
                },
                error: {
                    show: false,
                    msg: ''
                },
                searchValue: '',
            }
        },
        verify: {
            user: {
                name: ['required', 'username'],
                password: ['required', 'password'],
                email: ['required', 'email'],
            }
        },
        mounted() {
            axios.get('/api/users/session?t=' + Date.now()).then(res => {
                if (res.data.code === 200) {
                    this.isLogin = true;
                    this.user.name = res.data.data.name;
                    this.$store.dispatch('updateActionsUser', Object.assign({}, res.data.data, {isLogin: true}));
                    sessionStorage.setItem('id', res.data.data._id);
                    sessionStorage.setItem('role', res.data.data.role);
                }
            }).catch(err => {
                console.log(err);
            });
            this.defaultSearchValue();
        },
        methods: {
            defaultSearchValue() {
                const arr = ['手机', '电子产品', '服装鞋帽', '3C家电', '夏普', '食品', '服饰包包'];
                this.searchValue = arr[Math.floor(arr.length * Math.random())];
            },
            toLogin() {
                this.modal.show = true;
                this.modal.title = "登录";
                this.id = "login";
                this.$refs.forget.style.visibility = "visible";
                this.$refs.userEmail.style.display = "none";
                this.user.name = '';
                this.user.password = '';
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
                this.error.show = false;
            },
            enter() {
                if (this.$refs.userEmail.style.display === "block") {
                    // 注册
                    if (this.$verify.check()) {
                        axios.post('/api/users/register', this.user).then(res => {
                            if (res.data.code === 200) {
                                this.$router.push({name: 'Success', params: {msg: res.data.desc}});
                            } else {
                                this.error.show = true;
                                this.error.msg = res.data.desc;
                            }
                        }).catch(err => {
                            console.log(err);
                        })
                    }
                } else {
                    // 登录
                    if (this.$verify.check('name') && this.$verify.check('password')) {
                        axios.post('/api/users/login', this.user).then(res => {
                            if (res.data.code === 200) {
                                this.modal.show = false;
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
            toLogout() {
                axios.get('/api/users/logout?t=' + Date.now()).then(res => {
                    if (res.data.code === 200) {
                        this.isLogin = false;
                        this.user.name = '';
                        this.$router.push('/');
                        this.$store.dispatch('updateActionsUser', {isLogin: false});
                        sessionStorage.removeItem('id');
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
            checkValue() {
                const val = this.searchValue;
                let reg = /^\s*$/g;
                if (val === '' || reg.test(this.searchValue)) {
                    this.defaultSearchValue();
                }
            },
            toSearch() {
                const val = this.searchValue;
                let reg = /^\s*$/g;
                if (val !== '' || !reg.test(val)) {
                    this.$router.push({name: 'Search', params: {text: this.searchValue}});
                }
            }
        },
        components: {DropDown, Modal, Cart},
        props: ['navBread', 'showCart', 'showSearch']
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    @import '../assets/style/_flex';

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
        background: red;
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

    .bread-inner {
        background: #e5e5e5;
        margin-bottom: 15px;
    }

    .breadcrumb {
        margin: 0;
        padding: 15px;
        background: none;
        a {
            color: #333;
            &:hover {
                color: #e4393c;
                text-decoration: underline;
            }
        }
    }

    .login-bar {
        @include flex-box;
        @include justify-content(flex-end);
        @include align-items(center);
    }

    .bread-inner-bar {
        padding-left: 0;
    }

    .saleCar {
        float: right;
        position: relative;
        margin: 15px 0;
        width: 150px;
        height: 34px;
        background-color: #fff;
        @extend .login-bar;
        @include justify-content(center);
        border: 1px solid #adadad;
        cursor: pointer;
        color: #e02f2f;
        em {
            background: url("/static/svg/sale-car.svg") center no-repeat;
            width: 20px;
            height: 20px;
            background-size: contain;
            display: inline-block;
            margin-right: 5px;
        }
        i {
            position: absolute;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 1px solid #e02f2f;
            display: inline-block;
            right: 5px;
            top: 2px;
            background: #e02f2f;
            color: #fff;
            font-size: 12px;
            font-style: normal;
            text-align: center;
            line-height: 18px;
        }

    }
</style>
