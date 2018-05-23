<template>
    <div>
        <Header :navBread="navBread"></Header>
        <div class="container">
            <div class="row">
                <div class="col-md-2">
                    <div class="headPic" ref="imgPreview" :style="styleBgObj">
                        <span>上传图像
                            <input type="file" id="uploadPic" name="file" accept="image/png,image/gif,image/jpeg" @change="getFile($event)">
                        </span>
                    </div>
                    <div class="roleDesc" :class="roleClass">{{roleDesc}}</div>
                    <div class="userName">{{time}}好，{{user.name}}
                        <div class="time"><span ref="time"></span></div>
                    </div>
                </div>
                <div class="col-md-10">
                    <div class="row">
                        <div class="col-md-12">
                            <form class="form-horizontal">
                                <div class="form-group">
                                    <label for="UserName" class="col-md-2 control-label">用户名</label>
                                    <div class="col-md-10">
                                        <input type="text" class="form-control" id="UserName" v-model="user.name" disabled>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-2 control-label">姓别</label>
                                    <div class="col-md-10">
                                        <label class="radio-line radio-line-1">
                                            <input type="radio" id="man" name="sex" v-model="user.sex" value="男">
                                            <span>男</span>
                                        </label>
                                        <label class="radio-line radio-line-1">
                                            <input type="radio" id="woman" name="sex" v-model="user.sex" value="女">
                                            <span>女</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="UserEmail" class="col-md-2 control-label">邮箱</label>
                                    <div class="col-md-10">
                                        <input type="text" class="form-control" id="UserEmail" v-model="user.email">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="UserTel" class="col-md-2 control-label">手机</label>
                                    <div class="col-md-10">
                                        <input type="text" class="form-control" id="UserTel" v-model="user.tel">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="UserAddress" class="col-md-2 control-label">地址</label>
                                    <div class="col-md-10">
                                        <input type="text" class="form-control" id="UserAddress" v-model="user.address">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="UserSign" class="col-md-2 control-label">个性签名</label>
                                    <div class="col-md-10">
                                        <textarea rows="4" class="form-control" id="UserSign" v-model="user.sign"></textarea>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="col-md-offset-2 col-md-10">
                                        <button type="submit" @click="submitForm($event)" class="btn btn-danger" :disabled="disabled">提交</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from '../../components/Header';
    import axios from 'axios';
    import Time from '../../utils/Time';
    import Modal from '../../components/Modal';

    export default {
        name: "user-center",
        data() {
            return {
                navBread: [
                    {
                        path: '/',
                        name: '首页'
                    },
                    {
                        path: '/user/myOrder',
                        name: '我的订单'
                    },
                    {
                        path: '/user/center',
                        name: '个人中心'
                    }
                ],
                disabled: false,
                file: 0,
                user: {
                    name: '',
                    sex: '男',
                    email: '',
                    tel: '',
                    address: '',
                    sign: '',
                    img: '',
                },
                styleBgObj: 'backgroundImage: url(/static/images/default-head.png)',
                time: '',
                timer: null,
                roleClass: null,
                roleDesc: '',
            }
        },
        mounted() {
            this.getData();
            this.time = new Time().toTimeString();
        },
        created() {
            if (this.timer) {
                clearInterval(this.timer);
            }
            this.showTime();
        },
        beforeDestroy() {
            clearInterval(this.timer);
        },
        methods: {
            getData() {
                if (sessionStorage.getItem('id')) {
                    axios.get(`/api/users/info?id=${sessionStorage.getItem('id')}&t=${Date.now()}`).then(res => {
                        if (res.data.code === 200) {
                            const result = res.data.data;
                            this.user = Object.assign({}, this.user, result);
                            if (this.user.img) {
                                this.styleBgObj = `backgroundImage: url(/static/uploads/${this.user.img})`;
                            }
                            if (this.user.role > 10) {
                                this.roleClass = 'admin';
                                this.roleDesc = '超级管理员';
                            } else {
                                this.roleClass = 'ordinary';
                                this.roleDesc = '普通用户';
                            }
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }
            },
            submitForm(event) {
                event.preventDefault();
                let formData = new FormData();
                formData.append('file', this.file);
                formData.append('sex', this.user.sex);
                formData.append('email', this.user.email);
                formData.append('tel', this.user.tel);
                formData.append('address', this.user.address);
                formData.append('sign', this.user.sign);
                formData.append('name', this.user.name);
                // 添加私有的，看不到的，可以用formData.get('file')看有没有
                console.log(formData.get('file'));
                const config = {headers: {'Content-Type': 'multipart/form-data'}};
                axios.post('/api/users/updateInfo', formData, config).then(res => {
                    if (res.data.code === 200) {
                        this.$router.push({name: 'Success', params: {msg: '保存成功'}});
                    } else {
                        console.log("error:" + res.data.desc);
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            getFile(event) {
                this.file = event.target.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(this.file);
                reader.onload = (e) => {
                    this.$refs.imgPreview.style.backgroundImage = `url(${e.target.result})`;
                }
            },
            showTime() {
                this.timer = setInterval(() => {
                    const timeStr = new Date();
                    const m = new Time().formatDigit(timeStr.getMonth() + 1);
                    const t = timeStr.getFullYear() + "-" + m + "-" + new Time().formatDigit(timeStr.getDate()) + " " + new Time().formatDigit(timeStr.getHours()) + ":" + new Time().formatDigit(timeStr.getMinutes()) + ":" + new Time().formatDigit(timeStr.getSeconds());
                    this.$refs.time.innerHTML = "当前时间:" + t;
                }, 1000);
            }
        },
        components: {Header, Modal}
    }
</script>

<style scoped lang="scss">
    .headPic {
        margin: 20px auto;
        margin-bottom: 10px;
        width: 128px;
        height: 128px;
        position: relative;
        background-size: cover;
        overflow: hidden;
        border-radius: 50%;
        cursor: pointer;
        span {
            position: absolute;
            background: rgba(51, 51, 51, 0.6);
            left: 0;
            bottom: 0;
            height: 36px;
            line-height: 36px;
            text-align: center;
            color: #fff;
            width: 100%;
            display: inline-block;
            visibility: hidden;
        }
        &:hover {
            span {
                visibility: visible;
            }
        }
    }

    .userName {
        text-align: center;
        position: relative;
        .time {
            bottom: -25px;
            left: 0;
            width: 150%;
            text-align: left;
            position: absolute;
        }
    }

    #uploadPic {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        width: 100%;
        opacity: 0;
        cursor: pointer;
        height: 100%
    }

    .radio-line-1 {
        margin-bottom: 0;
        padding-top: 5px;
    }

    .roleDesc {
        text-align: center;
        font-weight: bold;
        padding: 3px 0;
    }

    .admin {
        color: #d01a39
    }

    .ordinary {
        color: #00B7FF;
    }
</style>
