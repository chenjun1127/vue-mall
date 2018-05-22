<template>
    <div>
        <Header :navBread="navBread"></Header>
        <div class="container">
            <Product :list="productList"/>
            <Pagination v-show="hasPagination" :totalPage="totalPage" :pageSize="pageSize" :pageNo="pageNo" v-on:toPageClick="toPageClick" v-on:prevClick="prevClick"
                        v-on:nextClick="nextClick"></Pagination>
            <NoData v-show="isNoData"/>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Header from '../components/Header';
    import Product from '../components/Product';
    import Pagination from '../components/Pagination';
    import NoData from '../components/NoData';

    export default {
        name: 'index',
        data() {
            return {
                isNoData: false,
                productList: [],
                navBread: [
                    {
                        path: '/',
                        name: '首页'
                    }
                ],
                hasPagination:false,
                totalPage: 0, // 总记录数
                pageNo: 1, // 从第一页开始
                pageSize: 8 // 每页几条数据
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                axios.get(`/api/products?pageNo=${this.pageNo}&pageSize=${this.pageSize}&t=${Date.now()}`).then(res => {
                    if (res.data.code === 200) {
                        this.totalPage = res.data.count;
                        if (res.data.list.length > 0) {
                            this.productList = [...res.data.list];
                            if (res.data.count > res.data.list.length) {
                                this.hasPagination = true;
                            }
                        } else {
                            this.isNoData = !this.isNoData;
                        }
                    } else {
                        console.log("error:" + res.data.desc);
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            prevClick(index) {
                this.pageNo = index;
                this.getData();
            },
            nextClick(index) {
                this.pageNo = index;
                this.getData();
            },
            toPageClick(index) {
                this.pageNo = index;
                this.getData();
            }
        },
        components: {Header, Product, Pagination,NoData}
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
