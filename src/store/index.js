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
    products: [],
    messageForProducts: null,
    message: null,
    messageForGetProducts: null,
    messageForFeedback: null,
    productUpdateAlert: null,
  },
  strict: debug,
});

export default store;
