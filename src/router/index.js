import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import Products from '@/views/Products';
import ProductList from '@/views/admin/ProductList';
import ProductSave from '@/views/admin/ProductSave';
import CategoryAdd from '@/views/admin/CategoryAdd';
import CategoryList from '@/views/admin/CategoryList';
import Success from '@/components/Success';
import Fail from '@/components/Fail';
import ProductDetail from '@/views/ProductDetail';
import Login from '@/views/Login';
import UserCenter from '@/views/user/Center';
import UserPassword from '@/views/user/Password';
import GetBack from '@/views/user/GetBack';
import ToCart from '@/views/ToCart';
import Search from '@/views/Search';
import Order from '@/views/Order';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
        },
        {
            path: '/product/list',
            name: 'ProductList',
            component: ProductList
        },
        {
            path: '/product/save',
            name: 'ProductSave',
            component: ProductSave
        },
        {
            path: '/product/detail',
            name: 'ProductDetail',
            component: ProductDetail
        },
        {
            path: '/category/add',
            name: 'CategoryAdd',
            component: CategoryAdd
        },
        {
            path: '/category/list',
            name: 'CategoryList',
            component: CategoryList
        },
        {
            path: '/category/products',
            name: 'Products',
            component: Products
        },
        {
            path: '/success',
            name: 'Success',
            component: Success
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/user/center',
            name: 'UserCenter',
            component: UserCenter
        },
        {
            path: '/user/password',
            name: 'UserPassword',
            component: UserPassword,
        },
        {
            path: '/user/password/getBack',
            name:'GetBack',
            component: GetBack
        },
        {
            path: '/fail',
            name:'Fail',
            component: Fail
        },
        {
            path: '/toCart',
            name:'toCart',
            component: ToCart
        },
        {
            path: '/search',
            name:'Search',
            component: Search
        },
        {
            path: '/order',
            name:'Order',
            component: Order
        }

    ]
})
