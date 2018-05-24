<template>
    <div>
        <Header :navBread="navBread" :showCart="noCart"></Header>
        <div class="container">
            <div class="row">
                <h1 class="title">全部商品</h1>
                <table class="table table-hover table-bordered">
                    <thead>
                    <tr>
                        <th>
                            <div id="select-all"><span @click="selectAll" :class="['select', selectedAll?'selected':'']"></span></div>
                        </th>
                        <th width="100">商品图片</th>
                        <th width="480">商品名称</th>
                        <th>数量</th>
                        <th>价格</th>
                        <th>小计</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item) in goodList">
                        <td><span @click="select(item)" v-model="item.checked" :class="['select', item.checked?'selected':'']"></span></td>
                        <td><img class="cartImg" :src="`/static/products/${item.image}`"/></td>
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
                    <tr v-show="noData">
                        <td colspan="7">暂无商品</td>
                    </tr>
                    </tbody>
                </table>
                <div class="price-sum">
                    <p class="goods-sum">已选择 <span>{{goodsSum}}</span> 件商品</p>
                    <p class="goods-price">总价：<span>￥{{formatPrice(goodsPriceTotal)}}</span></p>
                    <button class="btn btn-danger btn-lg" @click="toBalance" :disabled="disabled">去结算</button>
                </div>
            </div>
        </div>
        <Modal :modal="modal">
            <p slot="title">温馨提示</p>
            <p slot="content" style="text-align: center">确定删除吗？</p>
            <div slot="footer">
                <button class="btn btn-default" @click="cancelDel">取消</button>
                <button class="btn btn-danger" @click="enterDel">确定</button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Header from '../components/Header';
    import {sortByUp} from "../utils/index";
    import Modal from '../components/Modal';

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
                selectedAll: false,
                goodsPriceTotal: 0,
                goodsSum: 0,
                modal: {
                    title: '',
                    style: {
                        width: '400px',
                    },
                    show: false
                },
                delItem: '',
                disabled: true,
                noData: false,
            }
        },
        mounted() {
            this.goodList = this._unique();
            this.computedGoods(this.goodList);
        },
        methods: {
            _unique() {
                const list = this.$store.state.cartList;
                if (list.length === 0) return;
                const newList = [];
                const listMap = {};
                // 计算数组中重复值，及个数
                for (let i = 0, len = list.length, key; i < len; i++) {
                    key = list[i].id + '||' + list[i].name + '||' + list[i].price + '||' + list[i].image;  // key为id和name的组合，值为number
                    if (listMap[key]) {
                        listMap[key]++;
                    } else {
                        listMap[key] = 1;
                    }
                }
                console.log(listMap)
                // 根据个数，重新整理数组;
                for (let item in listMap) {
                    newList.push({
                        id: item.split('||')[0],
                        name: item.split('||')[1],
                        price: item.split('||')[2],
                        image: item.split('||')[3],
                        sum: listMap[item]
                    })
                }
                let trueArr = [];
                let falseArr = [];
                if (!list || list.length <= 0) return;

                for (let i = 0; i < list.length; i++) {
                    if (list[i].checked) {
                        trueArr.push({
                            id: list[i].id,
                            item: list[i]
                        })
                    } else {
                        falseArr.push({
                            id: list[i].id,
                            item: list[i]
                        })
                    }
                }
                let newArr = [...trueArr, ...falseArr];
                if (trueArr.length === 0) {
                    for (let i = 0; i < newList.length; i++) {
                        newList[i].checked = false;
                        this.selectedAll = false;
                    }
                } else if (falseArr.length === 0) {
                    for (let i = 0; i < newList.length; i++) {
                        newList[i].checked = true;
                        this.selectedAll = true;
                    }
                } else {
                    this.selectedAll = false;
                    for (let i = 0; i < newList.length; i++) {
                        for (let j in newArr) {
                            if (newArr[j].id === newList[i].id) {
                                newList[i].checked = newArr[j].item.checked;
                            }
                        }
                    }
                }
                return newList;
            },
            minus(item) {
                // 减少
                if (localStorage.getItem('cartList')) {
                    let list = JSON.parse(localStorage.getItem('cartList'));
                    let newObj = {
                        id: item.id,
                        name: item.name,
                        price: parseFloat(item.price),
                        image: item.image,
                        checked: item.checked
                    };
                    for (let i in list) {
                        if (list[i].id === newObj.id) {
                            list.splice(i, 1);
                            break;
                        }
                    }
                    localStorage.setItem('cartList', JSON.stringify(list));
                    this.$store.dispatch('updateActionsCart', list);
                    this.goodList = this._unique();
                    this.computedGoods(this.goodList);
                }
            },
            add(item) {
                // 增加
                if (localStorage.getItem('cartList')) {
                    let list = JSON.parse(localStorage.getItem('cartList'));
                    let newObj = {
                        id: item.id,
                        name: item.name,
                        price: parseFloat(item.price),
                        image: item.image,
                        checked: item.checked
                    };
                    let newList = [...list, ...[newObj]];
                    const sortedNewList = sortByUp(newList, 'price');
                    localStorage.setItem('cartList', JSON.stringify(sortedNewList));
                    this.$store.dispatch('updateActionsCart', sortedNewList);
                    this.goodList = this._unique();
                    this.computedGoods(this.goodList);
                }
            },
            blur(item, e) {
                // 失去焦点
                if (localStorage.getItem('cartList')) {
                    let list = JSON.parse(localStorage.getItem('cartList'));
                    const sum = e.target.value;
                    let newArr = [];
                    for (let i = 0; i < sum; i++) {
                        newArr.push({
                            id: item.id,
                            name: item.name,
                            price: parseFloat(item.price),
                            image: item.image,
                            checked: item.checked
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
                    let sortedNewList;
                    if (keepSum === 0) {
                        return false;
                    } else if (keepSum > 0) {
                        newArr.splice(keepSum);
                        let newList = [...list, ...newArr];
                        sortedNewList = sortByUp(newList, 'price');

                    } else {
                        list.splice(arr[0], Math.abs(keepSum));
                        sortedNewList = sortByUp(list, 'price');
                    }
                    localStorage.setItem('cartList', JSON.stringify(sortedNewList));
                    this.$store.dispatch('updateActionsCart', sortedNewList);
                    this.goodList = this._unique();
                    this.computedGoods(this.goodList);
                }
            },
            del(item) {
                // 删除
                this.modal.show = true;
                this.delItem = item;
            },
            cancelDel() {
                this.modal.show = false;
            },
            enterDel() {
                if (this.delItem && this.delItem !== '') {
                    this.modal.show = false;
                    let list = JSON.parse(localStorage.getItem('cartList'));
                    const arr = [];
                    for (let i in list) {
                        if (list[i].id === this.delItem.id) {
                            arr.push(i);
                        }
                    }
                    list.splice(arr[0], arr.length);
                    const sortedNewList = sortByUp(list, 'price');
                    localStorage.setItem('cartList', JSON.stringify(sortedNewList));
                    this.$store.dispatch('updateActionsCart', sortedNewList);
                    this.goodList = this._unique();
                    this.computedGoods(this.goodList);
                }
            },
            select(item) {
                let newList = this.goodList;
                let cartList = this.$store.state.cartList;
                for (let i in newList) {
                    if (newList[i].id === item.id) {
                        for (let j = 0; j < cartList.length; j++) {
                            if (cartList[j].id === item.id) {
                                cartList[j].checked = !item.checked;
                            }
                        }
                    }
                }
                localStorage.setItem('cartList', JSON.stringify(cartList));
                this.$store.dispatch('updateActionsCart', cartList);
                this.goodList = this._unique();
                this.computedGoods(this.goodList);
            },
            selectAll() {
                // 全选
                this.selectedAll = !this.selectedAll;
                let cartList = this.$store.state.cartList;
                for (let i in cartList) {
                    cartList[i].checked = this.selectedAll ? true : false;
                }
                localStorage.setItem('cartList', JSON.stringify(cartList));
                this.$store.dispatch('updateActionsCart', cartList);
                this.goodList = this._unique();
                this.computedGoods(this.goodList);
            },
            // 计算总价
            computedGoods(cartList) {
                let selectedCart = [];
                if (!cartList) {
                    this.noData = true;
                    this.selectedAll = false;
                    this.goodsSum = 0;
                    this.goodsPriceTotal = 0;
                    this.disabled = true;
                    return;
                }
                cartList.map((item) => {
                    if (item.checked) {
                        selectedCart.push(item);
                    }
                });
                if (selectedCart.length === 0) {
                    this.goodsSum = 0;
                    this.goodsPriceTotal = 0;
                } else if (selectedCart.length > 1) {
                    let s = 0, p = 0;
                    selectedCart.map((item) => {
                        s += item.sum;
                        p += item.sum * item.price;
                        this.goodsSum = s;
                        this.goodsPriceTotal = p;
                    })
                } else {
                    this.goodsSum = selectedCart[0].sum;
                    this.goodsPriceTotal = selectedCart[0].sum * selectedCart[0].price;
                }
                // 更新disabled;
                const arr = [];
                cartList.map(item => {
                    arr.push(item.checked);
                });
                this.disabled = arr.indexOf(true) > -1 ? false : true;
            },
            // 结算
            toBalance() {
                let orderList = [];
                if (this.goodList && this.goodList.length > 0) {
                    this.goodList.map(item => {
                        if (item.checked) {
                            orderList.push(item);
                        }
                    });
                }
                sessionStorage.setItem('orderList', JSON.stringify(orderList));
                this.$router.push('/order');
            }
        },
        components: {Header, Modal},
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

    table tr td, table tr th {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        &:nth-of-type(3) {
            text-align: left;
        }
    }

    .input-group-addon {
        cursor: pointer;
    }

    .cartImg {
        width: 80px;
        height: 80px;
    }

    .select {
        background: #FFF;
        color: #fff;
        border-radius: 50%;
        height: 18px;
        width: 18px;
        display: inline-block;
        position: relative;
        cursor: pointer;
        border: 1px solid #d9d9d9;
        transition: all 0.25s;
        &::before {
            position: absolute;
            content: "";
            display: block;
            width: 6px;
            height: 2px;
            font-size: 0;
            line-height: 0;
            left: 3px;
            top: 8px;
            background: #fff;
            z-index: 1;
            transform: rotate(45deg);
        }
        &::after {
            position: absolute;
            content: "";
            display: block;
            width: 8px;
            height: 2px;
            font-size: 0;
            line-height: 0;
            right: 2px;
            top: 7px;
            background: #fff;
            z-index: 2;
            transform: rotate(135deg);
        }
    }

    .selected {
        border-color: #d9534f;
        background: #d9534f;
        &::before {
            background: #fff;
        }
        &::after {
            background: #fff;
        }
    }

    .select-all-em {
        font-style: normal
    }

    .price-sum {
        @include flex-box;
        @include justify-content(flex-end);
        @include align-items(center);
        p {
            margin: 0;
            margin-right: 10px;
        }
        span {
            color: #d9534f;
            font-size: 18px;
        }
    }
</style>
