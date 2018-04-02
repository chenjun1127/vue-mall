<template>
    <div>
        <Header :navBread="navBread"></Header>
        <div class="container">
            <div class="row">
                <div class="col-md-3 card" v-for="item in productList">
                    <div class="card-content">
                        <div class="card-img" id="tt"><img class="card-img-top" v-lazy="`/static/images/${item.image}`"></div>
                        <h4 class="card-title">{{item.name}}</h4>
                        <p class="card-text">价格：<em>￥</em><span>{{formatPrice(item.price)}}</span></p>
                        <p class="card-text">库存：{{item.amount}}</p>
                        <button class="btn btn-danger pay-btn" @click="addCart(item._id,item.name,item.price)">立即购买</button>
                    </div>
                </div>
            </div>
            <div class="product-tips" v-show="ok">暂无商品</div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Header from '../components/Header';
    import {sortByUp} from "../utils/index";

    export default {
        name: 'index',
        data() {
            return {
                ok: false,
                productList: [],
                navBread: [
                    {
                        path: '/',
                        name: '首页'
                    }
                ]
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                axios.get('/api/products?t=' + Date.now()).then(res => {
                    if (res.data.list.length > 0) {
                        this.productList = res.data.list;
                    } else {
                        this.ok = !this.ok;
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            addCart(id, name, price) {
                if (this.$store.state.userInfo.isLogin) {
                    if (localStorage.getItem('cartList')) {
                        let list = JSON.parse(localStorage.getItem('cartList'));
                        let newList = [...list, ...[{id, name, price}]];
                        // 排序后的数组
                        const sortedNewList = sortByUp(newList, 'price');
                        localStorage.setItem('cartList', JSON.stringify(sortedNewList));
                        this.$store.dispatch('updateActionsCart', sortedNewList);
                    } else {
                        this.$store.dispatch('updateActionsCart', [{id, name, price}]);
                        localStorage.setItem('cartList', JSON.stringify([{id, name, price}]));
                    }
                } else {
                    this.$router.push({path: '/login'});
                }
            }
        },
        components: {Header}
    }
</script>

<style>
    .card {
        border: 1px solid #d9d9d9;
        box-shadow: 0 0 10px 3px #f5f5f5;
    }

    .card-img {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
    }

    .card-title {
        line-height: 1.6em;
        font-weight: bold;
        font-size: 14px;
        word-break: break-all;
        height: 60px;
    }

    .card-title img {
        max-width: 100%;
        max-height: 250px;
    }

    .pay-btn {
        margin: 10px auto 15px;
        /*background: #e4393c;*/
    }

    .card-text span {
        font-size: 20px;
        color: #e4393c;
    }

    .card-text em {
        font-size: 14px;
        font-style: normal;
        color: #e4393c;
    }

</style>
