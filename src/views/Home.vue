<template>
    <div class="container">
        <Header></Header>
        <div class="row">
            <div class="col-md-3 card" v-for="item in productList">
                <div class="card-content">
                    <router-link :to="{path:'/product/detail',query: {id: item._id}}">
                        <div class="card-img"><img class="card-img-top" v-lazy="`/static/images/${item.image}`" alt=""></div>
                        <h4 class="card-title">{{item.name}}</h4>
                    </router-link>
                    <p class="card-text">价格：<em>￥</em><span>{{formatPrice(item.price)}}</span></p>
                    <p class="card-text">库存：{{item.amount}}</p>
                    <router-link class="btn btn-primary pay-btn" :to="{path:'/product/detail',query: {id: item._id}}">立即购买</router-link>
                </div>
            </div>
        </div>
        <div class="product-tips" v-show="ok">暂无商品</div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Header from '../components/Header';

    export default {
        name: 'index',
        data() {
            return {
                msg: 1,
                ok: false,
                productList: []
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                axios.get('/api/products').then(res => {
                    if (res.data.list.length > 0) {
                        this.productList = res.data.list;
                    } else {
                        this.ok = !this.ok;
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            formatPrice(number) {
                return parseFloat(number).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:\.))/g, "$1,");
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
