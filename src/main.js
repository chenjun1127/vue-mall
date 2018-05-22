// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex';
import store from './vuex/store';
import '@/assets/boostarop/css/bootstrap.min.css';
import VueLazyLoad from 'vue-lazyload';
import tools from '@/plugins/tools';
import verify from "vue-verify-plugin";
import verifyRules from './verifyRules';

Vue.config.productionTip = false
Vue.use(VueLazyLoad, {
    loading: '/static/loading-svg/loading-bars.svg'
});
Vue.use(Vuex);
Vue.use(tools);
Vue.use(verify,{
    blur:true,
    rules:verifyRules
});
// 判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
    if (to.matched.some(res => res.meta.requireAuth)) {
        if (sessionStorage.getItem('role')>10) {
            next()
        } else {
            next({
                path: '/signIn',
                query: {redirect: to.name}
            })
        }
    } else {
        next()
    }
});
/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: {App},
})
