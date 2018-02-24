import axios from 'axios';
import * as types from '../mutation-types';
import router from '../../router';
/* eslint-disable no-shadow  */

// initial state
const state = {
  userFullname: null,
  email: null,
  jwtToken: null,
  message: null,
  fromLogin: null,
  fromSignup: null,
  userCategory: null,
};

// getters
const getters = {
  userFullname: state => state.userFullname,
  jwt: state => state.jwt,
  email: state => state.email,
  message: state => state.message,
};

// actions
const actions = {
  login({ commit }, credentials) {
    axios.post('/api/v1/users/login', credentials)
      .then(response =>
        commit(types.SIGN_IN, { ...response.data }),
      )
      .catch((error) => {
        localStorage.removeItem('32snksnsknskn');
        let message = 'An internal error occurred, please try again';
        if (error.response.status && error.response.status !== 500) {
          message = error.response.data.errorMessage;
        }
        return commit(types.MESSAGE, { from: 'login', message });
      });
  },
  signup({ commit }, credentials) {
    axios.post('/api/v1/users/signup', credentials)
      .then(response => commit(types.SIGN_IN, { ...response.data }))
      .catch((error) => {
        localStorage.removeItem('32snksnsknskn');
        let message = 'An internal error occurred, please try again';
        if (error.response.status && error.response.status !== 500) {
          message = error.response.data.errorMessage;
        }
        return commit(types.MESSAGE, { from: 'signup', message });
      });
  },
  remeberMeLogin({ commit }, credentials, fromHome = false) {
    commit(types.SIGN_IN, { ...credentials, fromHome });
  },
  logout({ commit }) {
    commit(types.LOGOUT, { });
  },
  /* eslint-disable no-undef */
  signwithThirdParty({ dispatch }) {
    FB.api('/me',
      { fields: [
        'email',
        'name',
      ],
      }, (user) => {
        const credentails = {
          email: user.email,
          password: null,
          is3rdParty: true,
          rememberMe: false,
        };
        dispatch('auth/login', credentails);
      });
  },
};

// mutations
const mutations = {
  [types.SIGN_IN](state, {
    userFullname,
    email,
    jwtToken,
    rememberText,
    fromHome,
    userCategory,
  }) {
    state.userFullname = userFullname;
    state.email = email;
    state.jwtToken = jwtToken;
    state.userCategory = userCategory;
    // clear former message
    state.message = '';
    state.fromLogin = null;
    state.fromSignup = null;
    localStorage.setItem('32snksnsknskn', rememberText);
    if (!fromHome) {
      router.push({ path: '/sellCard' });
    }
    // add the jwt to all http request
    axios.defaults.headers.common.Authorization = jwtToken;
  },
  [types.MESSAGE](state, { from, message }) {
    if (from === 'login') {
      state.fromLogin = true;
    } else if (from === 'signup') {
      state.fromSignup = true;
    }
    state.message = message;
  },
  [types.LOGOUT](state) {
    state.userFullname = null;
    state.email = null;
    state.jwtToken = null;
    localStorage.removeItem('32snksnsknskn');
    router.push({ path: '/' });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
