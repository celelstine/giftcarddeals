import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/pages/Home';
import SellCard from '@/pages/SellCard';
import OurRates from '@/pages/OurRates';
import Products from '@/pages/Products';
import TermsandConditions from '@/pages/TermsandConditions';
import Emails from '@/pages/Emails';
import Login from '@/pages/Login';
import Feedback from '@/pages/Feedback';
import AdminFeedback from '@/pages/AdminFeedback';
import ClientOrders from '@/pages/ClientOrders';
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
      name: 'SellCard',
      component: SellCard,
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
      path: '/ClientOrders',
      name: 'ClientOrders',
      component: ClientOrders,
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
      path: '/adminFeedback/:orderId/:email',
      name: 'AdminFeedback',
      component: AdminFeedback,
      beforeEnter: (to, from, next) => checkAdmin(next),
    },
    {
      path: '/adminFeedback',
      name: 'AdminFeedback1',
      component: AdminFeedback,
      beforeEnter: (to, from, next) => checkAdmin(next),
    },
    {
      path: '*',
      component: Home,
    },
  ],
});
