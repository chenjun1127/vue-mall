<template>
    <div class="row">
        <nav class="navbar navbar-default" role="navigation">
            <div class="container-fluid">
                <div class="navbar-header">
                    <a class="navbar-brand" href="#">基本菜单</a>
                </div>
                <div>
                    <ul class="nav navbar-nav">
                        <li v-for="(item,index) in menu">
                            <router-link :to="`${item.path}`"> {{item.text}}</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
    export default {
        name: 'Header',
        data() {
            return {
                menu: [
                    {
                        'text':'首页',
                        'path':'/',
                    },
                    {
                        'text':'所有商品',
                        'path':'/product/all',
                    },
                    {
                        'text':'商品列表',
                        'path':'/product/list',
                    },
                    {
                        'text':'商品录入',
                        'path':'/product/save',
                    },
                    {
                        'text':'新增分类',
                        'path':'/category/add',
                    },

                ],
            }
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
