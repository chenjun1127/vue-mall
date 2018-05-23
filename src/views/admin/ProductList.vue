<template>
    <div>
        <Header :navBread="navBread"></Header>
        <div class="container">
            <div class="row">
                <table class="table table-hover table-bordered">
                    <thead>
                    <tr>
                        <th width="50">序号</th>
                        <th>商品图片</th>
                        <th width="400">商品名称</th>
                        <th>时间</th>
                        <th>价格</th>
                        <th>数量</th>
                        <th>分类</th>
                        <th width="100">访问量(pv)</th>
                        <th width="150">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in productList" :id="`tr_${item._id}`">
                        <td>{{(index+1)+pageNo*pageSize-pageSize}}</td>
                        <td><img class="cartImg" :src="`/static/products/${item.image}`"/></td>
                        <td>{{item.name}}</td>
                        <td>{{formatTime(item.meta.createAt)}}</td>
                        <td>{{item.price}}</td>
                        <td>{{item.amount}}</td>
                        <td>{{item.category.name}}</td>
                        <td>{{item.pv}}</td>
                        <td>
                            <a href="javascript:void(0)" @click="toUpdate(item._id)" class="btn btn-success">修改</a>
                            <a href="javascript:void(0)" @click="toDelete(item._id)" class="btn btn-danger">删除</a>
                        </td>
                    </tr>
                    <tr v-show="isNoData">
                        <td colspan="9">
                            <NoData/>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <Pagination v-show="hasPagination" :totalPage="totalPage" :pageSize="pageSize" :pageNo="pageNo" v-on:toPageClick="toPageClick" v-on:prevClick="prevClick" v-on:nextClick="nextClick"></Pagination>
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
    </div>
</template>

<script>
    import Header from '../../components/Header';
    import Modal from '../../components/Modal';
    import axios from 'axios';
    import Pagination from '../../components/Pagination';
    import NoData from '../../components/NoData';

    export default {
        name: 'ProductList',
        data() {
            return {
                productList: [],
                modal: {
                    title: '温馨提示',
                    style: {
                        width: '400px',
                    },
                    show: false
                },
                productId: '',
                navBread: [
                    {
                        path: '/',
                        name: '首页'
                    }, {
                        path: '/',
                        name: '商品列表'
                    }
                ],
                isNoData: false, // 有没有数据
                hasPagination: false, // 有无分页
                totalPage: 0, // 总记录数
                pageNo: 1, // 从第一页开始
                pageSize: 10 // 每页几条数据
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                axios.get(`/api/products?pageNo=${this.pageNo}&pageSize=${this.pageSize}&t=${Date.now()}`).then(res => {
                    this.msg = res.data.code;
                    this.totalPage = res.data.count;
                    if (res.data.list.length > 0) {
                        this.productList = [...res.data.list];
                        if (res.data.count > res.data.list.length) {
                            this.hasPagination = true;
                        }
                    } else {
                        this.isNoData = !this.isNoData;
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            toUpdate(productId) {
                this.$router.push({path: '/product/save?id=' + productId});
            },
            toDelete(productId) {
                this.modal.show = true;
                this.productId = productId;
            },
            enter() {
                //  子组件传来的
                axios.post('/api/products/delete', {id: this.productId}, {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                }).then(res => {
                    if (res.data.code === 200) {
                        this.modal.show = false;
                        let child = document.getElementById('tr_' + this.productId);
                        child.parentNode.removeChild(child);
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            cancel() {
                this.modal.show = false;
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
        components: {Header, Modal, Pagination, NoData}
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    table {
        margin-bottom: 0;
        tr {
            th, td {
                display: table-cell;
                vertical-align: middle;
                text-align: center;
                a:last-child {
                    margin-left: 5px;
                }
                &:first-child, &:last-child {
                    text-align: center;
                }
                &:nth-of-type(3) {
                    text-align: left;
                }
            }
            th:last-child {
                text-align: center;
            }
        }
    }


</style>
