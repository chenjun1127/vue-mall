<template>
    <div>
        <Header :navBread="navBread"></Header>
        <div class="container">
            <div class="row">
                <Tabs :tabs="tabs" v-on:tabClick="tabClick"/>

                <table v-if="!noData" class="table table-hover table-bordered" v-for="item in orderList">
                    <thead>
                    <tr>
                        <th colspan="7">
                            <div class="order-title">
                                <span>{{formatTime(item.createTime)}}</span>
                                <span>订单号：{{item.orderId}}</span>
                                <span @click="removeOrder(item._id)"></span>
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td colspan="2">
                            <div class="product" v-for="e in item.goodsList">
                                <div><img class="cartImg" :src="`/static/products/${e.product.image}`"/></div>
                                <div>{{e.product.name}}</div>
                                <div>×{{e.sum}}</div>
                            </div>
                        </td>
                        <td width="100" :rowspan="item.goodsList.length">
                            {{item.deliverName}}
                        </td>
                        <td width="100" :rowspan="item.goodsList.length">
                            <p>{{item.deliverMethod}}</p>
                            <p> {{item.payMethod}}</p>
                        </td>
                        <td width="100" :rowspan="item.goodsList.length">
                            <div class="blue" v-if="item.status===1">已完成</div>
                            <div class="red" v-else-if="item.status===2">待支付</div>
                            <div class="gray" v-else>已取消</div>
                        </td>
                        <td width="100" :rowspan="item.goodsList.length">
                            总额：￥{{formatPrice(item.totalMoney)}}
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div v-else="noData" style="text-align: center">暂无订单，
                    <router-link class="link" to="/">去首页看看~</router-link>
                </div>
            </div>
        </div>
        <Modal :modal="modal">
            <p slot="title">温馨提示</p>
            <p slot="content" style="text-align: center">确定删除吗？</p>
            <div slot="footer">
                <button class="btn btn-default" @click="cancel">取消</button>
                <button class="btn btn-danger" @click="enter">确定</button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Header from '../../components/Header';
    import axios from 'axios';
    import Tabs from '../../components/Tabs';
    import Modal from '../../components/Modal';

    export default {
        name: "MyOrder",
        data() {
            return {
                navBread: [
                    {
                        path: '/',
                        name: '首页'
                    },
                    {
                        path: '/user/center',
                        name: '个人中心'
                    },
                    {
                        path: '/user/myOrder',
                        name: '我的订单'
                    }
                ],
                modal: {
                    title: '温馨提示',
                    style: {
                        width: '400px',
                    },
                    show: false
                },
                orderList: [],
                noData: false,
                tabs: {
                    title: ['全部订单', '已完成', '待支付', '已取消'],
                    activeIndex: 0
                },
                type: '',
                orderId: '',
            }
        },
        mounted() {
            if (!sessionStorage.getItem('id')) {
                this.$router.push('/');
            } else {
                // 1==> 全部，2==> 已完成,3==> 待支付,4==> 已取消
                this.getData(1);
            }
        },
        methods: {
            getData(type) {
                axios.get(`/api/order/list?id=${sessionStorage.getItem('id')}&type=${type}&t=${Date.now()}`).then(res => {
                    if (res.data.code === 200) {
                        this.type = type;
                        if (res.data.list.length > 0) {
                            this.orderList = [...res.data.list];
                            this.noData = false;
                        } else {
                            this.noData = true;
                        }
                    } else {
                        console.log("error:" + res.data.desc);
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            tabClick(index) {
                this.getData(index + 1);
                this.tabs.activeIndex = index;
            },
            cancel() {
                this.modal.show = false;
            },
            enter() {
                if (!this.orderId) return;
                axios.get(`/api/order/del?id=${this.orderId}&t=${Date.now()}`).then(res => {
                    if (res.data.code === 200) {
                        this.modal.show = false;
                        this.getData(this.type);
                    } else {
                        console.log("error:" + res.data.desc);
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            removeOrder(id) {
                this.modal.show = true;
                this.orderId = id;
            }
        },
        components: {Header, Tabs, Modal}
    }
</script>

<style scoped lang="scss">
    @import '../../assets/style/_flex';

    .order-title {
        @include flex-box;
        @include align-items(center);
        @include justify-content(space-between);
        :last-child {
            background: url("/static/images/remove.png") no-repeat;
            width: 18px;
            height: 18px;
            display: inline-block;
            background-size: contain;
            margin-left: 650px;
            cursor: pointer;
        }
    }

    .product {
        @include flex-box;
        @include align-items(center);
        margin: 10px 0;
        :first-child {
            width: 100px;
        }
        :nth-child(2) {
            text-align: left;
            padding: 0 10px;
            flex: 1;
            word-break: break-all;
        }

        div:last-child {
            width: 70px;
        }
    }

    table tr td {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        p {
            margin-bottom: 0
        }
    }

    .blue {
        color: #00B7FF
    }

    .red {
        color: #d01a39
    }

    .gray {
        color: #888
    }

    .tabs {
        margin-bottom: 20px;
    }

</style>
