<template>
    <div>
        <Header :navBread="navBread"></Header>
        <div class="container">
            <div class="alert alert-danger" v-show="isAlert">{{validateMsg}}</div>
            <form class="form-horizontal">
                <div class="form-group">
                    <label for="productName" class="col-md-2 control-label">商品名称</label>
                    <div class="col-md-10">
                        <input type="text" class="form-control" id="productName" @blur="validate($event)" v-model="productInfo.name"
                               placeholder="商品名称">
                    </div>
                </div>
                <div class="form-group">
                    <label for="productPrice" class="col-md-2 control-label">商品价格</label>
                    <div class="col-md-10">
                        <input type="text" class="form-control" id="productPrice" @blur="validate($event)" v-model="productInfo.price" placeholder="商品价格">
                    </div>
                </div>
                <div class="form-group">
                    <label for="productImage" class="col-md-2 control-label">商品图片</label>
                    <div class="col-md-10">
                        <input type="text" class="form-control" id="productImage" @blur="validate($event)" v-model="productInfo.image" placeholder="商品图片">
                    </div>
                </div>
                <div class="form-group">
                    <label for="productAmount" class="col-md-2 control-label">库存数量</label>
                    <div class="col-md-10">
                        <input type="text" class="form-control" id="productAmount" @blur="validate($event)" v-model="productInfo.amount" placeholder="库存数量">
                    </div>
                </div>
                <div v-if="isCategory">
                    <div class="form-group">
                        <label for="productAmount" class="col-md-2 control-label">商品类别</label>
                        <div class="col-md-10">
                            <select v-model="selected" class="form-control" @blur="validate($event)">
                                <option v-for="option in categories" v-bind:value="option.id">
                                    {{ option.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 control-label"></label>
                        <div class="col-md-10">
                            <p class="form-control-static">没找到合适的分类？去
                                <router-link :to="{path:'/category/add'}">添加分类</router-link>
                                吧！
                            </p>
                        </div>
                    </div>
                </div>

                <div v-else class="form-group">
                    <label class="col-md-2 control-label">商品类别</label>
                    <div class="col-md-10">
                        <p class="form-control-static">当前暂无分类，请先 <a href="javascript:void(0)" @click="addCategory">添加分类</a></p>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-10">
                        <button type="button" @click="getData" class="btn btn-danger" :disabled="disabled">提交</button>
                    </div>
                </div>
            </form>
            <Modal :modal="modal">
                <p slot="title">添加分类</p>
                <input slot="content" type="text" class="form-control" v-model="selected">
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
    import axios from 'axios';
    import Modal from '../../components/Modal';

    export default {
        name: 'Page2',
        data() {
            return {
                categories: [],
                selected: '',
                productInfo: {
                    category: '',
                    name: '',
                    price: '',
                    image: '',
                    amount: ''
                },
                validateMsg: '不能为空，请重新输入!',
                isAlert: false,
                disabled: true,
                isCategory: true,// 有无分类
                modal: {
                    show: false,
                    style: {
                        width: '400px',
                    }
                },
                navBread: [
                    {
                        path: '/',
                        name: '首页'
                    }, {
                        path: '/product/list',
                        name: '商品列表 '
                    }, {
                        path: '/',
                        name: '商品录入'
                    }
                ]
            }
        },
        mounted() {
            if (this.$route.query.id) {
                axios.post('/api/products/inquire', {id: this.$route.query.id}).then(res => {
                    if (res.data.code === 200) {
                        this.productInfo = res.data.data;
                    }
                }).catch(err => {
                    console.log(err);
                })
                this.navBread[this.navBread.length - 1].name = "商品更新";
            }
            this.getCategory();
        },
        methods: {
            // 获取商品分类：
            getCategory() {
                axios.get('/api/categories').then(res => {
                    if (res.data.code === 200) {
                        if (res.data.list.length > 0) {
                            let array = [];
                            res.data.list.map((item) => {
                                array.push({name: item.name, id: item._id});
                            });
                            this.categories = array;
                            this.selected = this.$route.query.id ? this.productInfo.category : this.categories[Math.floor(Math.random() * this.categories.length)].id;
                        } else {
                            this.isCategory = false;
                        }
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            getData() {
                axios.post('/api/products/save', Object.assign(this.productInfo, {category: this.selected}), {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                }).then(res => {
                    if (res.data.code === 200) {
                        this.$router.push({name: 'Success', params: {msg: '保存成功'}});
                    }
                }).catch(err => {
                    console.log(err);
                })

            },
            validate(e) {
                let value = e.target.value.trim();
                if (value === "" || value === null) {
                    e.target.classList.add('focus');
                    this.isAlert = true;
                } else {
                    this.isAlert = false;
                    e.target.classList.remove('focus');
                }
                let productArray = Object.values(this.productInfo).splice(1);
                let arr = [];
                for (let i in productArray) {
                    arr.push(productArray[i] === '');
                }
                arr.join().indexOf('true') > -1 ? this.disabled = true : this.disabled = false;
            },
            addCategory() {
                this.modal.show = true;
            },
            enter() {
                axios.post('/api/categories/add', {
                    name: this.selected
                }).then(res => {
                    if (res.data.code === 200) {
                        this.modal.show = false;
                        this.getCategory();
                        this.isCategory = true;
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            cancel() {
                this.modal.show = false;
            }
        },
        components: {Header, Modal}
    }
</script>

<style scoped>
    .form-control-static a {
        color: #286090;
    }

    .form-control-static a:hover {
        color: #e4393c;
    }
</style>
