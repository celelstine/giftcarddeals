import axios from 'axios';
import * as types from '../mutation-types';
/* eslint-disable no-shadow  */

// initial state
const state = {
  message: null,
  currentOrder: {},
  orders: [],
  placeOrderStatus: false,
  placingOrder: false,
  messageForClientOrder: false,
  count: null,
  curPage: null,
  pageCount: null,
};

// getters
const getters = {
  message: state => state.message,
  orderID: state => state.orderID,
  orders: state => state.orders,
  orderSerialNumber: state => state.orderSerialNumber,
  placeOrderStatus: state => state.placeOrderStatus,
};

// actions
const actions = {
  placeOrder({ commit }, { formData }) {
    commit(types.PLACING_ORDER, {});
    axios.post('/api/v1/order',
      formData,
      {
        headers: {
          'content-type': 'multipart/form-data',
        },
      },
    )
      .then((response) => {
        const { data } = response;
        commit(types.PLACE_ORDER_SUCCESS, { ...data });
      })
      .catch((error) => {
        let message = 'An internal error occurred, please try again';
        if (error.response.status && error.response.status !== 500) {
          message = error.response.data.message;
        }
        return commit(types.PLACE_ORDER_FAILURE, { message });
      });
  },
  getOrders({ commit }, { offset }) {
    commit(types.GETTING_ORDER, {});
    /* eslint-disable quote-props */
    /* eslint-disable comma-dangle */
    // const test = {
    //   count: 9,
    //   orders: [
    //     {
    //       'id': 12,
    //       'status': 'pending',
    //       'orderId': '15191-08053-68293',
    //       'rate': 'NaN',
    //       'productName': 'Generic card',
    //       'cardCurrency': '$',
    //       'email': 'okwudiri.okoro@andela.com',
    //       'bankName': 'First City Monument Bank',
    //       'bankAccountNumber': '4444444444',
    //       'bankAccountName': 'okwudiri Okoro',
    //       'createdAt': '2018-02-20T06:27:33.755Z'
    //     },
    //     {
    //       'id': 11,
    //       'status': 'pending',
    //       'orderId': '15191-07886-6470',
    //       'rate': 'NaN',
    //       'productName': 'Generic card',
    //       'cardCurrency': '$',
    //       'email': 'okwudiri.okoro@andela.com',
    //       'bankName': 'First City Monument Bank',
    //       'bankAccountNumber': '4444444444',
    //       'bankAccountName': 'okwudiri Okoro',
    //       'createdAt': '2018-02-20T06:24:46.761Z'
    //     },
    //     {
    //       'id': 10,
    //       'status': 'pending',
    //       'orderId': '15191-07714-63477',
    //       'rate': 'NaN',
    //       'productName': 'Generic card',
    //       'cardCurrency': '$',
    //       'email': 'okwudiri.okoro@gmail.com',
    //       'bankName': 'Ecobank Nigeria',
    //       'bankAccountNumber': '4444444444',
    //       'bankAccountName': 'okoro celestine',
    //       'createdAt': '2018-02-20T06:21:54.680Z'
    //     },
    //     {
    //       'id': 9,
    //       'status': 'pending',
    //       'orderId': '15187-02469-81798',
    //       'rate': '230',
    //       'productName': 'US Itunecard',
    //       'cardCurrency': '$',
    //       'email': 'okorocelestine@gmail.com',
    //       'bankName': 'Wema Bank',
    //       'bankAccountNumber': '4444444444',
    //       'bankAccountName': 'ww ww',
    //       'createdAt': '2018-02-15T13:47:49.825Z'
    //     },
    //   ],
    //   'curPage': 1,
    //   'pageCount': 3,
    //   'pageSize': 4,
    // };
    // return commit(types.GETTING_ORDER_SUCCESS, { ...test });
    axios.get(`/api/v1/orders?limit=3&offset=${offset}`)
      .then((response) => {
        const { data } = response;
        commit(types.GETTING_ORDER_SUCCESS, { ...data });
      })
      .catch((error) => {
        let message = 'An internal error occurred, please try again';
        if (error.response.status && error.response.status !== 500) {
          message = error.response.data.message;
        }
        return commit(types.GETTING_ORDER_FAILURE, { message });
      });
  },
};

// mutations
const mutations = {
  [types.PLACING_ORDER](state) {
    state.message = 'Registering your order...';
    state.currentOrder = null;
    state.orderSerialNumber = null;
    state.placeOrderStatus = false;
  },
  [types.PLACE_ORDER_SUCCESS](state, { orderId, status }) {
    state.message = `You Order has been successfully registered, orderID: ${orderId}`;
    state.currentOrder = { orderId, status };
    state.placeOrderStatus = true;
    state.orders = [state.currentOrder, ...state.orders];
  },
  [types.PLACE_ORDER_FAILURE](state, { message }) {
    if (message) {
      state.message = message;
    }
    state.currentOrder = null;
    state.orderSerialNumber = null;
    state.placeOrderStatus = false;
  },
  [types.GETTING_ORDER](state) {
    state.messageForClientOrder = true;
    state.message = 'Processing your request';
  },
  [types.GETTING_ORDER_SUCCESS](state, { orders, count, curPage, pageCount }) {
    state.orders = orders;
    state.count = count;
    state.curPage = curPage;
    state.pageCount = pageCount;
    state.messageForClientOrder = false;
  },
  [types.GETTING_ORDER_FAILURE](state, { message }) {
    state.messageForProducts = true;
    if (message) {
      state.message = message;
    }
    state.messageForClientOrder = true;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
