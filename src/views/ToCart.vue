<template>
    <div>
        <Header :navBread="navBread" :showCart="noCart"></Header>
        <div class="container">
            <div class="row">
                <h1 class="title">全部商品</h1>
                <table class="table table-hover table-bordered">
                    <thead>
                    <tr>
                        <th>全选</th>
                        <th>商品</th>
                        <th>数量</th>
                        <th>价格</th>
                        <th>小计</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item) in goodList">
                        <td>选择</td>
                        <td>{{item.name}}</td>
                        <td width="160">
                            <div class="input-group">
                                <div class="input-group-addon" @click="minus(item)"> -</div>
                                <input type="text" class="form-control" v-model="item.sum" maxlength="3" @blur="blur(item,$event)" style="text-align: center" placeholder="Amount">
                                <div class="input-group-addon" @click="add(item)">+</div>
                            </div>
                        </td>
                        <td>￥{{formatPrice(item.price)}}</td>
                        <td>￥{{formatPrice(item.price*item.sum)}}</td>
                        <td><a href="javascript:void(0)" @click="del(item)">删除</a></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from '../components/Header';
    import {sortByUp} from "../utils/index";

    export default {
        name: "toCart",
        data() {
            return {
                noCart: true,
                navBread: [
                    {
                        path: '/',
                        name: '首页'
                    },
                    {
                        path: '/toCart',
                        name: '购物车'
                    }
                ],
                goodList: [],
            }
        },
        mounted() {
            this.goodList = this._unique();
        },
        methods: {
            _unique() {
                const list = this.$store.state.cartList;
                const newList = [];
                const listMap = {};
                // 计算数组中重复值，及个数
                for (let i = 0, len = list.length, key; i < len; i++) {
                    key = list[i].id + '||' + list[i].name + '||' + list[i].price; // key为id和name的组合，值为number
                    if (listMap[key]) {
                        listMap[key]++;
                    } else {
                        listMap[key] = 1;
                    }
                }
                for (let item in listMap) {
                    newList.push({
                        id: item.split('||')[0],
                        name: item.split('||')[1],
                        price: item.split('||')[2],
                        sum: listMap[item]
                    })
                }
                return newList;
            },
            minus(item) {
                // 删除
                if (localStorage.getItem('cartList')) {
                    let list = JSON.parse(localStorage.getItem('cartList'));
                    let newObj = {
                        id: item.id,
                        name: item.name,
                        price: parseFloat(item.price)
                    };
                    console.log(list)
                    for (let i in list) {
                        console.log(i)
                        if (list[i].id === newObj.id) {
                            console.log(i);
                            list.splice(i, 1);
                            break;
                        }
                    }
                    localStorage.setItem('cartList', JSON.stringify(list));
                    this.$store.dispatch('updateActionsCart', list);
                    this.goodList = this._unique();
                }
            },
            add(item) {
                // 增加
                if (localStorage.getItem('cartList')) {
                    let list = JSON.parse(localStorage.getItem('cartList'));
                    let newObj = {
                        id: item.id,
                        name: item.name,
                        price: parseFloat(item.price)
                    };
                    let newList = [...list, ...[newObj]];
                    const sortedNewList = sortByUp(newList, 'price');
                    localStorage.setItem('cartList', JSON.stringify(sortedNewList));
                    this.$store.dispatch('updateActionsCart', sortedNewList);
                    this.goodList = this._unique();
                }
            },
            blur(item, e) {
                if (localStorage.getItem('cartList')) {
                    let list = JSON.parse(localStorage.getItem('cartList'));
                    const sum = e.target.value;
                    let newArr = [];
                    for (let i = 0; i < sum; i++) {
                        newArr.push({
                            id: item.id,
                            name: item.name,
                            price: parseFloat(item.price)
                        })
                    }
                    const arr = [];
                    for (let i in list) {
                        if (list[i].id === item.id) {
                            arr.push(i);
                        }
                    }
                    // 点击加号或减号与当前商品数量的差值
                    const keepSum = newArr.length - arr.length;
                    if (keepSum === 0) {
                        return false;
                    } else if (keepSum > 0) {
                        newArr.splice(keepSum);
                        let newList = [...list, ...newArr];
                        const sortedNewList = sortByUp(newList, 'price');
                        localStorage.setItem('cartList', JSON.stringify(sortedNewList));
                        this.$store.dispatch('updateActionsCart', sortedNewList);
                        this.goodList = this._unique();
                    } else {
                        list.splice(arr[0],Math.abs(keepSum));
                        const sortedNewList = sortByUp(list, 'price');
                        localStorage.setItem('cartList', JSON.stringify(sortedNewList));
                        this.$store.dispatch('updateActionsCart', sortedNewList);
                        this.goodList = this._unique();
                    }
                }
            },
            del(item){
                console.log(item)
            }
        },
        components: {Header},

    }
</script>

<style scoped lang="scss">
    @import '../assets/style/_flex';

    .title {
        font-size: 16px;
        border-bottom: 1px solid #d9d9d9;
        padding: 5px 0 15px;
        font-weight: 400;
        margin: 0;

    }

    table tr td {
        display: table-cell;
        vertical-align: middle;
    }

    .input-group-addon {
        cursor: pointer;
    }
</style>
