<template>
    <div>
        <Header :navBread="navBread"></Header>
        <div class="container">
            <div class="row">
                <table class="table table-hover table-bordered">
                    <thead>
                    <tr>
                        <th width="50">序号</th>
                        <th>名称</th>
                        <th width="150">时间</th>
                        <th>价格</th>
                        <th>数量</th>
                        <th width="80">分类</th>
                        <th width="150">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in productList" :id="`tr_${item._id}`">
                        <td>{{index + 1}}</td>
                        <td>{{item.name}}</td>
                        <td>{{moment(item.meta.updateAt)}}</td>
                        <td>{{item.price}}</td>
                        <td>{{item.amount}}</td>
                        <td>{{item.category.name}}</td>
                        <td>
                            <a href="javascript:void(0)" @click="toUpdate(item._id)" class="btn btn-default">修改</a>
                            <a href="javascript:void(0)" @click="toDelete(item._id)" class="btn btn-danger">删除</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <Modal :modal="modal">
                <p slot="title">温馨提示</p>
                <p slot="content" class="tips-danger">确定删除吗？</p>
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
    import moment from 'moment';
    moment.locale('zh-cn');

    export default {
        name: 'ProductList',
        data() {
            return {
                productList: [],
                modal: {
                    title: '确定删除吗？',
                    style: {
                        width: '400px',
                    },
                    show: false
                },
                productId: '',
                navBread:[
                    {
                        path: '/',
                        name: '首页'
                    }, {
                        path: '/user/center',
                        name: '商品列表 '
                    }
                ]
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                axios.get('/api/products').then(res => {
                    this.msg = res.data.code;
                    if (res.data.list.length > 0) {
                        this.productList = res.data.list;
                    } else {
                        this.ok = !this.ok;
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
            moment(date) {
                return moment(date).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        components: {Header, Modal}
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    table tr {
        td {
            display: table-cell;
            vertical-align: middle;
            a:last-child {
                margin-left: 5px;
            }
            &:first-child, &:last-child {
                text-align: center;
            }
        }
        th:last-child {
            text-align: center;
        }
    }

    .tips-danger {
        text-align: center;
    }
</style>
