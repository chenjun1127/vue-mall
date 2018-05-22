/**
 * Created by 0easy-23 on 2018/1/24
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    // 定义状态
    state: {
        author: 'jone-chen',
        cartList: null, // 购物车列表,
        userInfo: {isLogin: false}, // 是否登录
    },
    mutations: {
        change(state, time) {
            state.author += time;
        },
        updateCart(state, obj) {
            state.cartList = obj;
        },
        updateUserInfo(state, obj) {
            state.userInfo = Object.assign({}, obj);
        },
    },
    actions: {
        updateActionsUser(context, obj) {
            context.commit('updateUserInfo', obj);
        },
        updateActionsCart(context, obj) {
            context.commit('updateCart', obj);
        }
    }
});

export default store;
