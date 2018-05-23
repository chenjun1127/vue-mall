<template>
    <div>
        <Header :navBread="navBread" :showCart="true"/>
        <div class="container">
            <h4>填写并核对订单信息</h4>
            <h5 class="title_order">收货人信息 </h5>
            <div class="row">
                <div class="col-md-4" v-for="item in resultList">
                    <div class="card" :class="[item.set ? 'active':'']">
                        <h1>收货人：{{item.name}}</h1>
                        <h2>电话：{{item.tel}}</h2>
                        <h3>地址：{{item.preAddress}} {{item.address}}</h3>
                        <h4 v-if="item.set">
                            <a href="javascript:void(0)" @click="editor(item._id)">编辑</a>
                        </h4>
                        <h4 v-else>
                            <a href="javascript:void(0)" @click="setDefault(item._id)">设为默认地址</a>
                            <a href="javascript:void(0)" @click="editor(item._id)">编辑</a>
                            <a href="javascript:void(0)" @click="del(item._id)">删除</a>
                        </h4>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card" @click="addShippingAddress">
                        <span class="plus">+</span>
                    </div>
                </div>
                <div class="more" v-show="hasMore" @click="clickMore">MORE<span ref="span"></span></div>
            </div>
            <h5 class="title_order">支付方式</h5>
            <div class="payMethod">
                <SingleSelect :selectList="payMethodList" v-on:clickSelected="selectedPayMethod"></SingleSelect>
            </div>
            <h5 class="title_order">配送方式</h5>
            <div class="payMethod">
                <SingleSelect :selectList="deliverMethodList" v-on:clickSelected="selectedDeliverMethod"></SingleSelect>
            </div>
            <h5 class="title_order">送货清单</h5>
            <div class="row">
                <div class="col-md-12">
                    <table class="table" style="background: #f3fbfe">
                        <thead>
                        <tr>
                            <th width="100">商品图片</th>
                            <th>商品名称</th>
                            <th>数量</th>
                            <th>价格</th>
                            <th>小计</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in orderList">
                            <td><img class="cartImg" :src="`/static/products/${item.image}`"/></td>
                            <td>{{item.name}}</td>
                            <td>{{item.sum}}</td>
                            <td>{{item.price}}</td>
                            <td>￥{{formatPrice(item.price*item.sum)}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="payTips">
                <p><span>{{getTotal.totalSum}}</span>件商品，总商品金额：<span>￥{{formatPrice(getTotal.totalMoney)}}</span></p>
                <p>返现： <span :style="{'color':cost.rebate === 0 ? '#333':'#d01a39' }">-￥{{formatPrice(cost.rebate)}}</span></p>
                <p>运费： <span :style="{'color':cost.freight === 0 ? '#333':'#d01a39' }">￥{{formatPrice(cost.freight)}}</span></p>
                <p>服务费： <span :style="{'color':cost.serviceCharge === 0 ? '#333':'#d01a39' }">￥{{formatPrice(cost.serviceCharge)}}</span></p>
            </div>
            <div class="orderMsg">
                <p>应付总额：<em>￥{{formatPrice(getTotal.totalMoney+cost.freight+cost.serviceCharge-cost.rebate)}}</em></p>
                <p><i><b>寄送至</b> {{getSelectedAddress.deliverAddress}} </i> <i><b>收货人</b> {{getSelectedAddress.deliverName}}</i></p>
            </div>
            <div class="payBtn">
                <router-link to="/toCart" class="btn btn-success btn-lg">返回购物车</router-link>
                <button class="btn btn-danger btn-lg" @click="submitOrder">提交订单</button>
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
                                    <button type="button" class="btn btn-danger" @click="saveShippingAddress" :disabled="disabled">保存收货人信息</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Header from '../components/Header';
    import Modal from '../components/Modal';
    import axios from 'axios';
    import VDistpicker from 'v-distpicker';
    import SingleSelect from '../components/SingleSelect';

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
                        path: '/toCart',
                        name: '购物车'
                    },
                    {
                        path: '/',
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
                resultList: [],
                hasMore: false,
                showLength: 2, // 显示几个地址
                payMethodList: {
                    options: ['货到付款', '在线支付', '公司转账']
                },
                deliverMethodList: {
                    options: ['顺丰速递', '申通快递', '天天快递']
                },
                selectPayMethod: '货到付款',
                selectDeliverMethod: '顺丰速递',
                orderList: '',
                cost: {
                    rebate: 2, // 返现
                    freight: 10, // 运费
                    serviceCharge: 0 // 服务费
                }
            }
        },
        mounted() {
            this.getData();
            const orderList = sessionStorage.getItem('orderList') && JSON.parse(sessionStorage.getItem('orderList'));
            this.orderList = orderList;
        },
        methods: {
            clickMore() {
                if (this.resultList.length === this.showLength) {
                    this.resultList = this.addressList;
                    this.$refs.span.style.transform = 'rotate(0deg)';
                } else {
                    const newList = [...this.resultList];
                    newList.splice(this.showLength);
                    this.resultList = newList;
                    this.$refs.span.style.transform = 'rotate(180deg)';
                }
            },
            getData() {
                const userId = sessionStorage.getItem('id');
                if (!userId) return;
                axios.get(`/api/shippingAddress?id=${userId}`).then(res => {
                    if (res.data.code === 200) {
                        if (res.data.list && res.data.list.length > 0) {
                            this.addressList = [...res.data.list];
                            if (this.addressList.length > this.showLength) {
                                this.hasMore = true;
                                const newList = [...this.addressList];
                                newList.splice(this.showLength);
                                this.resultList = newList;
                            } else {
                                this.resultList = this.addressList;
                                this.hasMore = false;
                            }
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
            // 保存地址信息
            saveShippingAddress() {
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
                    this.receive.preAddress = this.defaultPicker.province + ' ' + this.defaultPicker.city + ' ' + this.defaultPicker.area;
                }
                const receiveObj = this.receive;
                let arr = [];
                for (let i in receiveObj) {
                    arr.push(receiveObj[i] === '');
                }
                arr.join().indexOf('true') > -1 ? this.disabled = true : this.disabled = false;
            },
            // 编辑
            editor(id) {
                this.modal.show = true;
                this.receive.addressId = id;
                axios.get(`/api/shippingAddress/getDetail?id=${id}`).then(res => {
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
            // 删除
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
            // 设为默认
            setDefault(id) {
                const userId = sessionStorage.getItem('id');
                if (!userId) return;
                axios.post('/api/shippingAddress/operate', {id: id, userId: userId, operateId: 2}).then(res => {
                    if (res.data.code === 200) {
                        this.getData();
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            selectedPayMethod(value) {
                this.selectPayMethod = value;
            },
            selectedDeliverMethod(value) {
                this.selectDeliverMethod = value;
            },
            submitOrder() {
                const userId = sessionStorage.getItem('id');
                if (!userId) return;
                let listArr = [];
                this.orderList.map(item => {
                    listArr.push({product: item.id, sum: item.sum});
                });
                console.log(listArr)
                let bodyData = Object.assign({}, {
                    ofUser: userId,
                    deliverMethod: this.selectDeliverMethod,
                    payMethod: this.selectPayMethod,
                    goodsList: listArr,
                    totalMoney: this.getTotal.totalMoney + this.cost.freight + this.cost.serviceCharge - this.cost.rebate,
                    cost:this.cost,
                }, this.getSelectedAddress);
                console.log(bodyData)
                axios.post('/api/order', bodyData).then(res => {
                    console.log(res);
                    if (res.data.code === 200) {
                        let cartList;
                        let newCartList = [];
                        if (localStorage.getItem('cartList')) {
                            cartList = JSON.parse(localStorage.getItem('cartList'));
                            for (let i in cartList) {
                                if (!cartList[i].checked) {
                                    newCartList.push(cartList[i]);
                                }
                            }
                        }
                        localStorage.setItem('cartList', JSON.stringify(newCartList));
                        this.$store.dispatch('updateActionsCart', newCartList);
                        console.log(JSON.parse(localStorage.getItem('cartList')));
                        console.log(this.$store.state.cartList);
                        this.$router.push('/orderSuccess');
                    }
                }).catch(err => {
                    console.log(err);
                })

            }
        },

        computed: {
            getSelectedAddress() {
                let deliverAddress, deliverName, deliverTel;
                if (this.resultList.length > 0) {
                    this.resultList.map(item => {
                        if (item.set) {
                            deliverAddress = item.preAddress + ' ' + item.address;
                            deliverName = item.name;
                            deliverTel = item.tel;
                        }
                    })
                }
                return {deliverAddress, deliverName, deliverTel};
            },
            getTotal() {
                let totalMoney = 0, totalSum = 0;
                if (!this.orderList) return {totalMoney, totalSum};
                this.orderList.map(item => {
                    totalMoney += (item.price * item.sum);
                    totalSum += item.sum;
                });
                return {totalMoney, totalSum};
            }
        },
        components: {Header, Modal, VDistpicker, SingleSelect}
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
        height: 168px;
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

    .plus {
        width: 100%;
        height: 100%;
        position: relative;
        @include flex-box;
        @include align-items(center);
        @include justify-content(center);
        font-size: 100px;
        font-family: -webkit-pictograph;
        color: #afafaf;
    }

    table tr td, table tr th {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        &:nth-of-type(2) {
            text-align: left;
        }
        &:last-child {
            text-align: right;
        }
    }

    .cartImg {
        width: 80px;
        height: 80px;
        display: block;
        margin: 0 auto;
    }

    .more {
        @include flex-box;
        @include align-items(center);
        @include justify-content(center);
        clear: both;
        cursor: pointer;
        color: #d01a39;
        span {
            position: relative;
            width: 20px;
            height: 20px;
            display: inline-block;
            transition: all 0.2s ease 0s;
            transform: rotate(180deg);
            &:before {
                content: '';
                position: absolute;
                left: 3px;
                bottom: 9px;
                height: 2px;
                width: 9px;
                background: #d01a39;
                transform: rotate(-45deg);
            }
            &:after {
                content: '';
                position: absolute;
                left: 8px;
                bottom: 9px;
                height: 2px;
                width: 9px;
                background: #d01a39;
                transform: rotate(45deg);
            }
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

    .payTips {
        text-align: right;
        line-height: 1.8em;
        padding: 0 10px;
        p {
            margin: 0;
            span {
                color: #d01a39;
            }
        }
    }

    .orderMsg {
        background: #f4f4f4;
        margin: 15px 0;
        padding: 15px 10px;
        @extend .payTips;
        em {
            font-weight: bold;
            color: #d01a39;
            font-size: 24px;
            font-style: normal;
        }
        i {
            font-style: normal;
            display: inline-block;
            margin-left: 20px;
        }
    }

    .payBtn {
        text-align: right;
        padding-bottom: 15px;
        button {
            margin-left: 5px;
        }
    }

    .focus {
        border-color: #d01a39;
        outline: 0;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(208, 26, 57, .6);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(208, 26, 57, .6);
    }
</style>
