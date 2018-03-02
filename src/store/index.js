import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import * as actions from './actions';
// import * as mutations from './mutations';
import auth from './modules/auth';
import order from './modules/order';
import staffEmail from './modules/sfaffEmail';
import * as types from './mutation-types';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';
const store = new Vuex.Store({
  actions,
  mutations: {
    [types.GETTINGPRODUCTS](state) {
      state.messageForGetProducts = true;
      state.message = 'Loading Our product catalog';
    },
    [types.GETPRODUCTS](state, products) {
      state.messageForGetProducts = false;
      state.products = products;
    },
    [types.ADDING_PRODUCT](state) {
      state.messageForProducts = true;
      state.message = 'Processing your request';
    },
    [types.NEW_PRODUCT](state, product) {
      state.products = [product, ...state.products];
      state.messageForProducts = true;
      state.message = `${product.name} has been added to our catalog, successfully`;
    },
    [types.NEW_PRODUCT_FAILURE](state, { message }) {
      state.messageForProducts = true;
      let incomingMessage = message;
      if (!incomingMessage) {
        incomingMessage = 'An Error occurred, please try again';
      }
      state.message = message;
    },
    [types.UPDATING_PRODUCT](state) {
      state.messageForProducts = true;
      state.message = 'Processing your request';
    },
    [types.UPDATE_PRODUCT_SUCCESS](state, curProduct) {
      // Find index of specific object using findIndex method and update the products state
      const currentProducts = state.products;
      const updatedProductIndex = currentProducts
        .findIndex((product => product.id === curProduct.id));
      currentProducts[updatedProductIndex] = curProduct;
      state.products = currentProducts;
      state.messageForProducts = true;
      state.message = `${curProduct.name} has been updated successfully`;
    },
    [types.UPDATE_PRODUCT_FAILURE](state, { message }) {
      state.messageForProducts = true;
      let incomingMessage = message;
      if (!incomingMessage) {
        incomingMessage = 'An Error occurred, please try again';
      }
      state.message = message;
    },
    [types.GETPRODUCTS_FAILURE](state, { message }) {
      state.messageForGetProducts = true;
      let incomingMessage = message;
      if (!incomingMessage) {
        incomingMessage = 'An Error occurred, please try again';
      }
      state.message = message;
    },
    [types.SENDING_FEEDBACK](state) {
      state.messageForFeedback = true;
      state.message = 'Sending your feedback to the response Team';
    },
    [types.SENDING_FEEDBACK_FAILURE](state, { message }) {
      state.messageForFeedback = true;
      let incomingMessage = message;
      if (!incomingMessage) {
        incomingMessage = 'An Error occurred, please try again';
      }
      state.message = message;
    },
    [types.SENDING_FEEDBACK_SUCCESS](state) {
      state.messageForFeedback = true;
      state.message = 'Your feedback has been recieved successfully';
    },
    [types.PRODUCT_UPDATE_ALERT](state) {
      state.productUpdateAlert = 'The Product catalog has been updated';
    },
    [types.NEW_PRODUCT_ALERT](state) {
      state.productUpdateAlert = 'A New Product has been added to the product catalog';
    },
  },
  modules: {
    auth,
    order,
    staffEmail,
  },
  plugins: debug ? [createLogger()] : [],
  state: {
    /* eslint-disable */
    products: [{"id":2,"name":"testing","rate":33,"bulkrate":40,"isActive":false,"image_url":"productImages/itunes-gift-card-pile.png","extra":null,"cardCurrency":"#","createdAt":"2018-02-15T14:42:37.959Z","updatedAt":"2018-02-15T14:42:37.959Z"},{"id":3,"name":"skskb","rate":22,"bulkrate":34,"isActive":true,"image_url":"productImages/IMG-20170424-WA0003.jpg","extra":"null","cardCurrency":"$","createdAt":"2018-03-02T14:39:27.317Z","updatedAt":"2018-03-02T15:34:01.015Z"},{"id":4,"name":"Generic card","rate":30,"bulkrate":35,"isActive":true,"image_url":"/gift_card_blue.png","extra":"US gift card","cardCurrency":"$","createdAt":"2018-02-13T09:47:28.336Z","updatedAt":"2018-02-20T05:20:20.759Z"},{"id":1,"name":"Generic card","rate":30,"bulkrate":35,"isActive":true,"image_url":"/gift_card_blue.png","extra":"US gift card","cardCurrency":"$","createdAt":"2018-02-13T09:47:28.336Z","updatedAt":"2018-02-20T05:20:20.759Z"}],
    messageForProducts: null,
    message: null,
    messageForGetProducts: null,
    messageForFeedback: null,
    productUpdateAlert: null,
  },
  strict: debug,
});

export default store;
