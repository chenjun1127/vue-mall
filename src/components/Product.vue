<template>
    <div class="row">
        <div class="col-md-3 card" v-for="item in list">
            <div class="card-content">
                <div class="card-img" id="tt"><img class="card-img-top" v-lazy="`/static/products/${item.image}`"></div>
                <h4 class="card-title">{{item.name}}</h4>
                <p class="card-text">价格：<em>￥</em><span>{{formatPrice(item.price)}}</span></p>
                <p class="card-text">库存：{{item.amount}}</p>
                <button class="btn btn-danger pay-btn" @click="addCart(item._id,item.name,item.price,item.image)">立即购买</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {sortByUp} from "../utils/index";

    export default {
        name: "product",
        methods: {
            addCart(id, name, price, image) {
                let cartList = JSON.parse(localStorage.getItem('cartList'));
                if (this.$store.state.userInfo.isLogin) {
                    if (cartList && cartList.length > 0) {
                        let newList;
                        for (let i in cartList) {
                            // console.log(id,cartList[i].id);
                            if (id === cartList[i].id) {
                                newList = [...cartList, ...[{id, name, price, image, checked: cartList[i].checked}]];
                            } else {
                                newList = [...cartList, ...[{id, name, price, image, checked: true}]];
                            }
                        }
                        // 排序后的数组
                        const sortedNewList = sortByUp(newList, 'price');
                        localStorage.setItem('cartList', JSON.stringify(sortedNewList));
                        this.$store.dispatch('updateActionsCart', sortedNewList);
                    } else {
                        let list = [{id, name, price, image, checked: true}];
                        this.$store.dispatch('updateActionsCart', list);
                        localStorage.setItem('cartList', JSON.stringify(list));
                    }
                } else {
                    this.$router.push({path: '/login'});
                }
            }
        },
        props: ['list']
    }
</script>

