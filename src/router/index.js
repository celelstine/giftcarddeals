import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Order from '@/components/Order';
import OurRates from '@/components/OurRates';
import Products from '@/components/Products';
import TermsandConditions from '@/components/TermsandConditions';
import Emails from '@/components/Emails';
import Login from '@/components/Login';
import Feedback from '@/components/Feedback';
import {
  checkAdmin,
} from './auth';

Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter: (to, from, next) => checkAdmin(next),
    },
    {
      path: '/login1',
      name: 'login_without_admincheck',
      component: Login,
    },
    {
      path: '/sellCard',
      name: 'Order',
      component: Order,
    },
    {
      path: '/products',
      name: 'Products',
      component: Products,
      beforeEnter: (to, from, next) => checkAdmin(next),
    },
    {
      path: '/emails',
      name: 'Emails',
      component: Emails,
      beforeEnter: (to, from, next) => checkAdmin(next),
    },
    {
      path: '/ourRates',
      name: 'OurRates',
      component: OurRates,
    },
    {
      path: '/TermsandConditions',
      name: 'TermsandConditions',
      component: TermsandConditions,
    },
    {
      path: '/feedback',
      name: 'Feedback',
      component: Feedback,
    },
    {
      path: '/feedback/:orderId',
      name: 'orderFeedback',
      component: Feedback,
    },
    {
      path: '*',
      component: Home,
    },
  ],
});
