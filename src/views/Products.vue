<template>
    <div>
        <Header :navBread="navBread"></Header>
        <div class="container">
            <div class="row">
                <h4 class="search-title">当前分类：{{$route.query.name}}</h4>
                <Product :list="results"/>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from '../components/Header';
    import axios from 'axios';
    import Product from '../components/Product';

    export default {
        name: 'product',
        data() {
            return {
                navBread: [
                    {
                        path: '/',
                        name: '首页'
                    },
                    {
                        path: '/category/list',
                        name: '分类列表'
                    },
                    {
                        path: '/',
                        name: '当前分类'
                    }
                ],
                results:'',
                noData:false,
            }
        },
        mounted() {
            axios.get(`/api/categories/products?id=${this.$route.query.id}`).then(res=>{
                if (res.data.code === 200) {
                    if (res.data.data.length > 0) {
                        this.results = res.data.data;
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
        methods: {
        },
        components: {Header,Product}
    }
</script>

<style scoped>
    .drop-wrap {
        position: relative;
    }

    .drop-btn {
        border: 1px solid #adadad;
        padding: 8px 10px;
        border-radius: 4px;
        text-decoration: none;
        display: inline-block;
    }

    .drop-btn:hover {
        background: #eee;
    }

    .caret {
        display: inline-block;
        width: 0;
        height: 0;
        margin-left: 2px;
        vertical-align: middle;
        border-top: 4px dashed;
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
    }

    .drop-menu {
        list-style: none;
        padding: 0;
        margin-top: 4px;
        background-color: #fff;
        -webkit-background-clip: padding-box;
        background-clip: padding-box;
        border: 1px solid #ccc;
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 1000;
        border-radius: 4px;
        -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
        box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
    }

    .drop-menu li a {
        display: block;
        padding: 8px 15px;
        clear: both;
        font-weight: 400;
        line-height: 1.42857143;
        color: #333;
        white-space: nowrap;
        text-decoration: none;
    }

    .drop-menu li a:hover {
        background: #eee;
    }
</style>
