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
    axios.get(`/api/v1/orders?limit=3&offset=${offset}`)
      .then((response) => {
        const { data } = response;
        commit(types.GETTING_ORDER_SUCCESS, { ...data });
      })
      .catch((error) => {
        let message = 'An internal error occurred, please try again';
        if (error.response.status
          &&
          error.response.status !== 500
          &&
          error.response.data.message
        ) {
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
