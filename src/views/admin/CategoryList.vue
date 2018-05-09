<template>
    <div>
        <Header :navBread="navBread"></Header>
        <div class="container">
            <div class="row">
                <table class="table table-hover table-bordered">
                    <thead>
                    <tr>
                        <th width="50">序号</th>
                        <th>分类名称</th>
                        <th>合计（{{sum}}）</th>
                        <th>录入时间</th>
                        <th width="210">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in categoryList" :id="`tr_${item._id}`">
                        <td>{{index + 1}}</td>
                        <td>{{item.name}}</td>
                        <td>{{item.products.length}}</td>
                        <td>{{formatTime(item.meta.createAt)}}</td>
                        <td>
                            <a href="javascript:void(0)" @click="toLook(item._id,item.name)" class="btn btn-default">查看</a>
                            <a href="javascript:void(0)" @click="toUpdate(item._id,item.name)" class="btn btn-success">修改</a>
                            <a href="javascript:void(0)" @click="toDelete(item._id)" class="btn btn-danger">删除</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <Modal :modal="modal">
            <p slot="title">温馨提示</p>
            <p slot="content" style="text-align: center">确定删除该分类吗？删除后该分类下数据也被删除</p>
            <div slot="footer">
                <button class="btn btn-default" @click="cancel">取消</button>
                <button class="btn btn-danger" @click="enter">确定</button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Header from '../../components/Header';
    import Modal from '../../components/Modal';
    import axios from 'axios';

    export default {
        name: 'categoryList',
        data() {
            return {
                name: '',
                disabled: true,
                navBread: [
                    {
                        path: '/',
                        name: '首页'
                    }, {
                        path: '/',
                        name: '分类列表'
                    }
                ],
                categoryList: null,
                categoryId: '',
                modal: {
                    title: '温馨提示',
                    style: {
                        width: '400px',
                    },
                    show: false
                },
                sum:0,
            }
        },
        mounted() {
            this.getCategory();
        },
        methods: {
            getCategory() {
                axios.get('/api/categories').then(res => {
                    console.log(res);
                    this.categoryList = res.data.list;
                    this.categoryList.map(item => {
                        this.sum += item.products.length;
                    })
                }).catch(err => {
                    console.log(err);
                })
            },
            toLook(id, name) {
                this.$router.push({path: '/category/products?id=' + id + '&name=' + name})
            },
            toUpdate(id, name) {
                this.$router.push({path: '/category/add?id=' + id + '&name=' + name})
            },
            toDelete(id) {
                this.modal.show = true;
                this.categoryId = id;
            },
            cancel() {
                this.modal.show = false;
            },
            enter() {
                axios.post('/api/categories/delete', {id: this.categoryId}, {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                }).then(res => {
                    if (res.data.code === 200) {
                        this.modal.show = false;
                        let child = document.getElementById('tr_' + this.categoryId);
                        child.parentNode.removeChild(child);
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
        },
        components: {Header, Modal}
    }
</script>

<style scoped lang="scss">
    table tr {
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
            &:nth-of-type(2) {
                text-align: left;
            }
        }
        th:last-child {
            text-align: center;
        }
    }

</style>

