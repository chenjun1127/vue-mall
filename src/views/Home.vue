<template>
    <div>
        <Header :navBread="navBread"></Header>
        <div class="container">
            <Product :list="productList"/>
            <div class="product-tips" v-show="ok">暂无商品</div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Header from '../components/Header';
    import Product from '../components/Product';

    export default {
        name: 'index',
        data() {
            return {
                ok: false,
                productList: '',
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
                    if (res.data.code === 200) {
                        if (res.data.list.length > 0) {
                            this.productList = res.data.list;
                        } else {
                            this.ok = !this.ok;
                        }
                    } else {
                        console.log("error:" + res.data.desc);
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
        },
        components: {Header, Product}
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
