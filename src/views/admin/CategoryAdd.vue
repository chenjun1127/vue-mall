<template>
    <div>
        <Header :navBread="navBread"></Header>
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label for="productCategory" class="col-md-2 control-label">商品类别</label>
                            <div class="col-md-10">
                                <input type="text" class="form-control" id="productCategory" @blur="validate($event)" v-model="name" placeholder="请输入商品类别">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-md-offset-2 col-md-10">
                                <button type="button" @click="addCategory" class="btn btn-danger" :disabled="disabled">提交</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from '../../components/Header';
    import axios from 'axios';

    export default {
        name: 'categoryAdd',
        data() {
            return {
                name: '',
                disabled: true,
                navBread: [
                    {
                        path: '/',
                        name: '首页'
                    }, {
                        path: '/category/list',
                        name: '分类列表 '
                    }, {
                        path: '/',
                        name: '添加分类'
                    }
                ]
            }
        },
        mounted() {
            console.log(this.$route.query.id, this.$route.query.name);
            if (this.$route.query.id) {
                this.name = this.$route.query.name;
                this.navBread[this.navBread.length - 1].name = "更新分类";
            }
        },
        methods: {
            addCategory() {
                let _body = this.$route.query.id ? {name: this.name, id: this.$route.query.id} : {name: this.name};
                axios.post('/api/categories/add', _body).then(res => {
                    if (res.data.code === 200) {
                        this.$router.push({name: 'Success', params: {msg: '保存成功', url: '/category/list'}});
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            validate(e) {
                let value = e.target.value.trim();
                if (value === "" || value === null) {
                    e.target.classList.add('focus');
                    this.disabled = true;
                } else {
                    this.disabled = false;
                    e.target.classList.remove('focus');
                }
            }
        },
        components: {Header}
    }
</script>

<style scoped>
    .focus {
        border-color: #d01a39;
        outline: 0;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(208, 26, 57, .6);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(208, 26, 57, .6);
    }
</style>
