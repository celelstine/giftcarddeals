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
  // checkJwt,
  checkAdmin,
} from './auth';

Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      // beforeEnter: (to, from, next) => checkJwt(next, to),
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      // beforeEnter: (to, from, next) => checkJwt(next, to),
    },
    {
      path: '/sellCard',
      name: 'Order',
      component: Order,
      // beforeEnter: (to, from, next) => checkJwt(next, to),
    },
    {
      path: '/admin',
      name: 'Products',
      component: Products,
      beforeEnter: (to, from, next) => checkAdmin(next, to),
    },
    {
      path: '/emails',
      name: 'Emails',
      component: Emails,
      beforeEnter: (to, from, next) => checkAdmin(next, to),
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
    // {
    //   path: '/orders',
    //   name: 'ClientOrders',
    //   component: ClientOrders,
    //   beforeEnter: (to, from, next) => checkJwt(next, to),
    // },
    {
      path: '/feedback',
      name: 'Feedback',
      component: Feedback,
      // beforeEnter: (to, from, next) => checkJwt(next, to),
    },
    {
      path: '/feedback/:orderId',
      name: 'orderFeedback',
      component: Feedback,
      // beforeEnter: (to, from, next) => checkJwt(next, to),
    },
    {
      path: '*',
      component: Home,
      // beforeEnter: (to, from, next) => checkJwt(next, to),
    },
  ],
});
