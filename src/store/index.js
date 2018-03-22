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
      state.messageForFeedback = null;
      state.messageForProducts = null;
      state.message = 'Loading Our product catalog';
    },
    [types.GETPRODUCTS](state, products) {
      state.messageForGetProducts = false;
      state.messageForFeedback = null;
      state.messageForProducts = null;
      state.products = products;
    },
    [types.ADDING_PRODUCT](state) {
      state.messageForProducts = true;
      state.messageForFeedback = null;
      state.messageForGetProducts = null;
      state.message = 'Processing your request';
    },
    [types.NEW_PRODUCT](state, product) {
      state.products = [product, ...state.products];
      state.messageForProducts = true;
      state.messageForFeedback = null;
      state.messageForGetProducts = null;
      state.message = `${product.name} has been added to our catalog, successfully`;
    },
    [types.NEW_PRODUCT_FAILURE](state, { message }) {
      state.messageForProducts = true;
      state.messageForFeedback = null;
      state.messageForGetProducts = null;
      let incomingMessage = message;
      if (!incomingMessage) {
        incomingMessage = 'An Error occurred, please try again';
      }
      state.message = incomingMessage;
    },
    [types.UPDATING_PRODUCT](state) {
      state.messageForProducts = true;
      state.messageForFeedback = null;
      state.messageForGetProducts = null;
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
      state.messageForFeedback = null;
      state.messageForGetProducts = null;
      state.message = `${curProduct.name} has been updated successfully`;
    },
    [types.UPDATE_PRODUCT_FAILURE](state, { message }) {
      state.messageForProducts = true;
      state.messageForFeedback = null;
      state.messageForGetProducts = null;
      let incomingMessage = message;
      if (!incomingMessage) {
        incomingMessage = 'An Error occurred, please try again';
      }
      state.message = incomingMessage;
    },
    [types.GETPRODUCTS_FAILURE](state, { message }) {
      state.messageForGetProducts = true;
      state.messageForFeedback = null;
      state.messageForProducts = null;
      let incomingMessage = message;
      if (!incomingMessage) {
        incomingMessage = 'An Error occurred, please try again';
      }
      state.message = incomingMessage;
    },
    [types.SENDING_FEEDBACK](state) {
      state.messageForFeedback = true;
      state.messageForGetProducts = null;
      state.messageForProducts = null;
      state.message = 'Sending your feedback to the response Team';
    },
    [types.SENDING_FEEDBACK_FAILURE](state, { message }) {
      state.messageForFeedback = true;
      state.messageForGetProducts = null;
      state.messageForProducts = null;
      let incomingMessage = message;
      if (!incomingMessage) {
        incomingMessage = 'An Error occurred, please try again';
      }
      state.message = incomingMessage;
    },
    [types.SENDING_FEEDBACK_SUCCESS](state) {
      state.messageForFeedback = true;
      state.messageForGetProducts = null;
      state.messageForProducts = null;
      state.message = 'Your feedback has been recieved successfully';
    },
    [types.PRODUCT_UPDATE_ALERT](state) {
      state.productUpdateAlert = 'The Product catalog has been updated';
    },
    [types.NEW_PRODUCT_ALERT](state) {
      state.productUpdateAlert = 'A New Product has been added to the product catalog';
    },
    [types.SENDING_ADMIN_FEEDBACK](state) {
      state.messageForFeedback = false;
      state.messageForAdminFeedback = true;
      state.messageForGetProducts = null;
      state.messageForProducts = null;
      state.message = 'Sending feedback to the client.....';
    },
    [types.SEND_ADMIN_FEEDBACK_FAILURE](state, { message }) {
      state.messageForFeedback = false;
      state.messageForAdminFeedback = true;
      state.messageForGetProducts = null;
      state.messageForProducts = null;
      let incomingMessage = message;
      if (!incomingMessage) {
        incomingMessage = 'An Error occurred, please try again';
      }
      state.message = incomingMessage;
    },
    [types.SENT_ADMIN_FEEDBACK](state) {
      state.messageForFeedback = false;
      state.messageForAdminFeedback = true;
      state.messageForGetProducts = null;
      state.messageForProducts = null;
      state.message = 'The feedback has been sent successfully';
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
    products: [
      {
        id: 3,
        name: "skskb",
        acronym: "tts",
        rate: 22,
        highDenominationRate: 34,
        isActive: true,
        image_url: "/static/assests/images/itunes-gift-card-pile.4728efc.png",
        extra: "null",
        cardCurrency: "$",
        createdAt: "2018-03-02T14:39:27.317Z",
        updatedAt: "2018-03-02T21:01:30.171Z"
      },
      {
        id: 1,
        name: "Generic card",
        acronym: "usi",
        rate: 33,
        highDenominationRate: 35,
        isActive: true,
        image_url: "/static/assests/images/itunes-gift-card-pile.4728efc.png",
        extra: "US gift card",
        cardCurrency: "$",
        createdAt: "2018-02-13T09:47:28.336Z",
        updatedAt: "2018-03-02T21:50:28.854Z"
      },
      {
        id: 3,
        name: "skskb",
        acronym: "tts",
        rate: 22,
        highDenominationRate: 34,
        isActive: true,
        image_url: "/static/assests/images/itunes-gift-card-pile.4728efc.png",
        extra: "null",
        cardCurrency: "$",
        createdAt: "2018-03-02T14:39:27.317Z",
        updatedAt: "2018-03-02T21:01:30.171Z"
      },
      {
        id: 1,
        name: "Generic card",
        acronym: "usi",
        rate: 33,
        highDenominationRate: 35,
        isActive: true,
        image_url: "/static/assests/images/itunes-gift-card-pile.4728efc.png",
        extra: "US gift card",
        cardCurrency: "$",
        createdAt: "2018-02-13T09:47:28.336Z",
        updatedAt: "2018-03-02T21:50:28.854Z"
      },
      {
        id: 3,
        name: "skskb",
        acronym: "tts",
        rate: 22,
        highDenominationRate: 34,
        isActive: true,
        image_url: "/static/assests/images/itunes-gift-card-pile.4728efc.png",
        extra: "null",
        cardCurrency: "$",
        createdAt: "2018-03-02T14:39:27.317Z",
        updatedAt: "2018-03-02T21:01:30.171Z"
      },
      {
        id: 1,
        name: "Generic card",
        acronym: "usi",
        rate: 33,
        highDenominationRate: 35,
        isActive: true,
        image_url: "/static/assests/images/itunes-gift-card-pile.4728efc.png",
        extra: "US gift card",
        cardCurrency: "$",
        createdAt: "2018-02-13T09:47:28.336Z",
        updatedAt: "2018-03-02T21:50:28.854Z"
      },
    ],
    messageForProducts: null,
    message: null,
    messageForGetProducts: null,
    messageForFeedback: null,
    productUpdateAlert: null,
    messageForAdminFeedback: null,
  },
  strict: debug,
});

export default store;
