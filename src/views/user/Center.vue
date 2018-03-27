<template>
    <div>
        <Header :navBread="navBread"></Header>
        <div class="container">
            暂无权限
        </div>
    </div>
</template>

<script>
    import Header from '../../components/Header';

    export default {
        name: "user-center",
        data() {
            return {
                navBread: [
                    {
                        path: '/',
                        name: '首页'
                    }, {
                        path: '/user/center',
                        name: '个人中心'
                    }
                ]
            }
        },
        components: {Header}
    }
</script>

<style scoped>

</style>
