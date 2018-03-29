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

Vue.config.productionTip = false
Vue.use(VueLazyLoad, {
    loading: '/static/loading-svg/loading-bars.svg'
});
Vue.use(Vuex);
Vue.use(tools);
/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: {App},
})
