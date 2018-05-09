<template>
    <div>
        <Header :navBread="navBread" :showCart="true"/>
        <div class="container">
            <h4>填写并核对订单信息</h4>
            <h5 class="title_order">收货人信息 <a href="javascript:;" @click="addShippingAddress">新增收获地址</a></h5>
            <div class="row">
                <div class="col-md-4" v-for="item in addressList">
                    <div class="card" :class="[item.set ? 'active':'']">
                        <h1>收货人：{{item.name}}</h1>
                        <h2>电话：{{item.tel}}</h2>
                        <h3>地址：{{item.preAddress}} {{item.address}}</h3>
                        <h4 v-if="item.set"><a href="javascript:void(0)" @click="editor(item._id)">编辑</a></h4>
                        <h4 v-else><a href="javascript:void(0)" @click="setDefault(item._id)">设为默认地址</a> <a href="javascript:void(0)" @click="editor(item._id)">编辑</a> <a
                            href="javascript:void(0)" @click="del(item._id)">删除</a></h4>
                    </div>
                </div>
                <div class="tipsAddress" v-show="noAddress">暂无收货人信息，先去<a href="javascript:;" @click="addShippingAddress">添加</a>吧</div>
            </div>
        </div>
        <Modal :modal="modal">
            <p slot="title">温馨提示</p>
            <div slot="content">
                <div class="row">
                    <div class="col-md-12">
                        <div class="alert alert-danger" v-show="isAlert">{{validateMsg}}</div>
                        <form class="form-horizontal">
                            <div class="form-group">
                                <label class="col-md-2 control-label" style="margin-top: 5px;">所在地区</label>
                                <div class="col-md-10">
                                    <v-distpicker :province="defaultPicker.province" :city="defaultPicker.city" :area="defaultPicker.area" @province="onChangeProvince"
                                                  @city="onChangeCity" @area="onChangeArea" @selected="onSelected"></v-distpicker>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="receiveName" class="col-md-2 control-label">收货人姓名</label>
                                <div class="col-md-10">
                                    <input type="text" class="form-control" id="receiveName" @blur="validate($event)" v-model="receive.name" placeholder="请输入收货人姓名">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="receiveAddress" class="col-md-2 control-label">详细地址</label>
                                <div class="col-md-10">
                                    <input type="text" class="form-control" id="receiveAddress" @blur="validate($event)" v-model="receive.address" placeholder="请输入详细地址">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="receiveTel" class="col-md-2 control-label">手机号码</label>
                                <div class="col-md-10">
                                    <input type="text" class="form-control" id="receiveTel" @blur="validate($event)" v-model="receive.tel" placeholder="请输入手机号码">
                                </div>
                            </div>
                            <div class="form-group" style="margin-bottom: 0">
                                <div class="col-md-offset-2 col-md-10">
                                    <button type="button" class="btn btn-danger" @click="submit" :disabled="disabled">保存收货人信息</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <!--<div slot="footer">-->
            <!--<button class="btn btn-default">取消</button>-->
            <!--<button class="btn btn-danger">确定</button>-->
            <!--</div>-->
        </Modal>
    </div>
</template>

<script>
    import Header from '../components/Header';
    import Modal from '../components/Modal';
    import axios from 'axios';
    import VDistpicker from 'v-distpicker';

    export default {
        name: "order",
        data() {
            return {
                navBread: [
                    {
                        path: '/',
                        name: '首页'
                    },
                    {
                        path: '/订单',
                        name: '订单'
                    }
                ],
                modal: {
                    title: '添加收货地址',
                    style: {width: '800px'},
                    footerStyle: {display: 'none'},
                    show: false
                },
                receive: {
                    name: '',
                    tel: '',
                    address: '',
                    preAddress: '',
                },
                defaultPicker: {
                    province: '广东省',
                    city: '深圳市',
                    area: '福田区'
                },
                disabled: true,
                validateMsg: '不能为空，请重新输入!',
                isAlert: false,
                addressList: [],
                noAddress: false,
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                const userId = sessionStorage.getItem('id');
                if (!userId) return;
                axios.get(`/api/shippingAddress?id=${userId}`).then(res => {
                    console.log(res);
                    if (res.data.code === 200) {
                        if (res.data.list && res.data.list.length > 0) {
                            this.addressList = [...res.data.list];
                            this.noAddress = false;
                        } else {
                            this.noAddress = true;
                        }
                    }
                })
            },
            addShippingAddress() {
                this.modal.show = true;
                this.receive.name = '';
                this.receive.tel = '';
                this.receive.address = '';
                this.receive.preAddress = '';
                this.receive.addressId = null;
                this.defaultPicker = {
                    province: '广东省',
                    city: '深圳市',
                    area: '福田区'
                };
            },
            submit() {
                const userId = sessionStorage.getItem('id');
                if (!userId) return;
                axios.post('/api/shippingAddress/save', Object.assign({}, this.receive, {ofUser: userId})).then(res => {
                    if (res.data.code === 200) {
                        this.modal.show = false;
                        this.getData();
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            onChangeProvince(data) {
                this.checkSelected(data.value, "省");
            },
            onChangeCity(data) {
                this.checkSelected(data.value, "市");
            },
            onChangeArea(data) {
                this.checkSelected(data.value, "区");
            },
            onSelected(data) {
                this.receive.preAddress = data.province.value + ' ' + data.city.value + ' ' + data.area.value;
                this.checkItem();
            },
            validate(e) {
                let value = e.target.value.trim();
                if (e.target.id === 'receiveTel') {
                    if (!(/^1[34578]\d{9}$/.test(value))) {
                        this.isAlert = true;
                        e.target.classList.add('focus');
                        this.validateMsg = "手机号码错误，请重新输入！";
                    } else {
                        this.isAlert = false;
                        e.target.classList.remove('focus');
                    }
                } else {
                    if (value === "" || value === null) {
                        e.target.classList.add('focus');
                        this.isAlert = true;
                    } else {
                        this.isAlert = false;
                        e.target.classList.remove('focus');
                    }
                }
                this.checkItem();
                console.log(this.defaultPicker, this.receive.preAddress)
            },
            checkSelected(value, text) {
                if (value === text) {
                    this.isAlert = true;
                    this.validateMsg = "请重新选择！";
                } else {
                    this.isAlert = false;
                }
            },
            checkItem() {
                if (this.receive.preAddress === '') {
                    console.log(111, this.defaultPicker)
                    this.receive.preAddress = this.defaultPicker.province + ' ' + this.defaultPicker.city + ' ' + this.defaultPicker.area;
                }
                const receiveObj = this.receive;

                let arr = [];
                for (let i in receiveObj) {
                    arr.push(receiveObj[i] === '');
                }
                console.log(Date.now(), arr, receiveObj)
                arr.join().indexOf('true') > -1 ? this.disabled = true : this.disabled = false;
            },
            editor(id) {
                this.modal.show = true;
                this.receive.addressId = id;
                axios.get(`/api/shippingAddress/getDetail?id=${id}`).then(res => {
                    console.log(res);
                    if (res.data.code === 200) {
                        this.receive.name = res.data.data.name;
                        this.receive.preAddress = res.data.data.preAddress;
                        this.receive.tel = res.data.data.tel;
                        this.receive.address = res.data.data.address;
                        const preAddress = res.data.data.preAddress;
                        this.defaultPicker.province = preAddress.split(' ')[0];
                        this.defaultPicker.city = preAddress.split(' ')[1];
                        this.defaultPicker.area = preAddress.split(' ')[2];
                    }
                })
            },
            del(id) {
                console.log(id);
                const userId = sessionStorage.getItem('id');
                if (!userId) return;
                axios.post('/api/shippingAddress/operate', {id: id, userId: userId, operateId: 1}).then(res => {
                    if (res.data.code === 200) {
                        this.getData();
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            setDefault(id){
                console.log(id);
                const userId = sessionStorage.getItem('id');
                if (!userId) return;
                axios.post('/api/shippingAddress/operate', {id: id, userId: userId, operateId: 2}).then(res => {
                    if (res.data.code === 200) {
                        this.getData();
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
        },
        components: {Header, Modal, VDistpicker}
    }
</script>

<style scoped lang="scss">
    @import '../assets/style/_flex';

    .title_order {
        font-weight: bold;
        font-size: 16px;
        padding: 10px 0;
        a {
            float: right;
            color: #d01a39;
            font-weight: normal;
            font-size: 14px;
            text-decoration: none;
        }
    }

    .card {
        border: 1px solid #d9d9d9;
        margin-bottom: 25px;
        padding: 15px;
        cursor: pointer;
        h1, h2, h3, h4 {
            font-size: 14px;
            line-height: 1.8em;
            margin: 0;
        }
        h3 {
            height: 60px;
        }
        a {
            color: #d01a39;
        }
        &:hover {
            border: 1px solid #d01a39;
        }
    }

    .active {
        border: 1px solid #d01a39;
        position: relative;
        &:after {
            width: 0;
            height: 0;
            border-color: #d01a39 transparent;
            border-width: 0 0 20px 20px;
            border-style: solid;
            position: absolute;
            right: 0;
            bottom: 0;
            content: '';
        }
        &:before {
            content: '';
            position: absolute;
            right: 0;
            bottom: 0;
            display: block;
            color: #fff;
            background: url("/static/svg/selected.svg");
            background-size: cover;
            width: 13px;
            height: 13px;
            z-index: 1000;
            transform: rotate(-8deg);
        }
    }

    .tipsAddress {
        text-align: center;
        padding: 50px 0;
        a {
            color: #d01a39;
        }
    }

    .focus {
        border-color: #d01a39;
        outline: 0;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(208, 26, 57, .6);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(208, 26, 57, .6);
    }
</style>
