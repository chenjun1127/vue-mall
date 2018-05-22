<template>
    <div>
        <Header :navBread="navBread"></Header>
        <div class="container">
            <div class="row">
                <h1>恭喜您，支付成功！</h1>
                <p>
                    <router-link to="/toCart">再来一单</router-link>
                    <router-link to="/">返回首页</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from '../components/Header';

    export default {
        name: "orderSuccess",
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
                        name: '订单确认'
                    }
                ],

            }
        },
        components: {Header}
    }
</script>

<style scoped>
    .row h1 {
        text-align: center;
        font-size: 32px;
        color: #333;
        padding: 100px 0 30px 0;
    }

    .row p {
        text-align: center;
    }

    .row p a {
        display: inline-block;
        background: #d9534f;
        color: #fff;
        padding: 10px 15px;
        font-size: 16px;
        margin: 0 5px;
    }

    .row p a:hover {
        background: #C9302C;
    }
</style>
