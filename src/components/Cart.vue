<template>
    <div class="cart" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
        <em></em>
        <span>我的购物车</span>
        <i>{{$store.state.userInfo.isLogin && $store.state.cartList.length > 0 ? $store.state.cartList.length : 0}}</i>
        <div class="cartBox" :style="{'display':show ? 'block':'none'}">
            <div v-if="hasGoods">
                <ul>
                    <li v-for="item in goodList" :key="item.id">
                        <img class="cartImg" :src="`/static/products/${item.image}`"/>
                        <div>{{item.name}}</div>
                        <p>
                            <span>￥{{formatPrice(item.price)}} × {{item.sum}}</span>
                            <a href="javascript:void(0)" @click="del(item.id,item.sum)">删除</a>
                        </p>
                    </li>
                </ul>
                <div class="cartTotal">
                    <p>共{{$store.state.cartList.length}}件商品，总计￥<span>{{formatPrice(totalPrice)}}</span>元</p>
                    <p>
                        <router-link to="/toCart">去购物车</router-link>
                    </p>
                </div>
            </div>
            <div v-else class="noCart">{{cartMsg}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "cart",
        data() {
            return {
                show: false,
                goodList: 0,
                hasGoods: false,
                totalPrice: 0,
                cartMsg: '',
            }
        },
        mounted() {
            if (localStorage.getItem('cartList')) {
                let list = JSON.parse(localStorage.getItem('cartList'));
                this.$store.dispatch('updateActionsCart', list);
            }
        },
        methods: {
            mouseEnter() {
                this.show = true;
                this._createGoodsList();
            },
            mouseLeave() {
                this.show = false;
            },
            del(id, sum) {
                let list = JSON.parse(localStorage.getItem('cartList'));
                if (list.length === 0) return;
                for (let i = 0; i < list.length; i++) {
                    if (list[i].id.indexOf(id) > -1) {
                        list.splice(i, sum);
                    }
                }
                this.$store.dispatch('updateActionsCart', list);
                localStorage.setItem('cartList', JSON.stringify(list));
                this._createGoodsList();
            },
            _createGoodsList() {
                if (this.$store.state.userInfo.isLogin) {
                    this.goodList = this._unique();
                    console.log(this.goodList)
                    if(this.goodList){
                        this.hasGoods = this.goodList.length > 0 ? true : false;
                    }else{
                        this.hasGoods = false;
                    }
                    // 计算金额
                    if (this.goodList && this.goodList.length > 0) {
                        const priceArr = this.goodList.map(ele => parseFloat(ele.price) * ele.sum);
                        this.totalPrice = priceArr.reduce((prev, next) => prev + next);
                    } else {
                        this.cartMsg = "购物车还没有商品，去选购吧！";
                    }
                } else {
                    this.cartMsg = "当前未登录，去登录吧！";
                    this.hasGoods = false;
                }
            },
            _unique() {
                const list = this.$store.state.cartList;
                const newList = [];
                const listMap = {};
                // 计算数组中重复值，及个数
                if (list.length === 0) return;
                for (let i = 0, len = list.length, key; i < len; i++) {
                    key = list[i].id + '||' + list[i].name + '||' + list[i].price + '||' + list[i].image; // key为id和name的组合，值为number
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
                        image: item.split('||')[3],
                        sum: listMap[item]
                    })
                }
                return newList;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../assets/style/_flex';

    .cart {
        float: right;
        position: relative;
        margin: 15px 0;
        width: 150px;
        height: 34px;
        background-color: #F9F9F9;
        @include flex-box;
        @include align-items(center);
        @include justify-content(center);
        border: 1px solid #dfdfdf;
        cursor: pointer;
        color: #e02f2f;
        em {
            background: url("/static/svg/sale-car.svg") center no-repeat;
            width: 20px;
            height: 20px;
            background-size: contain;
            display: inline-block;
            margin-right: 5px;
        }
        i {
            position: absolute;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 1px solid #e02f2f;
            display: inline-block;
            right: 5px;
            top: 2px;
            background: #e02f2f;
            color: #fff;
            font-size: 12px;
            font-style: normal;
            text-align: center;
            line-height: 18px;
        }
        &:hover {
            background-color: #fff;
            box-shadow: 0 0 4px rgba(0, 0, 0, .2);
            .cartBox {
                box-shadow: 0 0 4px rgba(0, 0, 0, .2);
            }
            &::before {
                bottom: -2px;
                background: #fff;
            }
        }
        &::before {
            content: "";
            display: block;
            width: 100%;
            height: 5px;
            background: #f9f9f9;
            font-size: 0;
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 1001;
            transition: all .25ms;
        }
    }

    .cartImg {
        width: 80px;
        height: 80px;
        margin-right: 10px;
    }

    .cartBox {
        position: absolute;
        right: -1px;
        top: 32px;
        width: 400px;
        border: 1px solid #d9d9d9;
        background: #fff;
        display: none;
        z-index: 1000;
        ul {
            padding: 0;
            margin: 0;
            li {
                list-style: none;
                @include flex-box;
                @include align-items(center);
                margin: 0 10px;
                border-bottom: darkgray dashed 1px;
                padding: 10px 0;
                p {
                    margin: 0;
                    width: 32%;
                    @include flex-box;
                    @include align-items(flex-end);
                    @include justify-content(center);
                    @include flex-direction(column);
                }
                div {
                    @include flex(1);
                    color: #333;
                }

            }
        }
    }

    .noCart {
        text-align: center;
        padding: 15px;
        color: #999;
        @include flex-box;
        @include align-items(center);
        @include justify-content(center);
    }

    .cartTotal {
        @include flex-box;
        @include align-items(center);
        @include justify-content(space-between);
        padding: 10px;
        padding-bottom: 0;
        p {
            &:last-child {
                a {
                    display: inline-block;
                    background: #e02f2f;
                    color: #fff;
                    border-radius: 0.25rem;
                    padding: 8px 15px;
                }
            }
        }
    }
</style>
