import axios from 'axios';
import * as types from '../store/mutation-types';
import { store } from '../store';

// const store = createStore();
export const logout = (commit, next) => {
  commit(types.LOGOUT);
  next('/');
};

export const checkRemeberme = (next) => {
  /* eslint-disable */
  if ('32snksnsknskn' in localStorage) {
    const rememberText = localStorage.getItem('32snksnsknskn');
    axios.post('/api/v1/getUserwithRememberMeToken', { rememberText })
      .then((response) => {
        localStorage.getItem('32snksnsknskn', response.data.payload.rememberText);
        store.dispatch('auth/remeberMeLogin', response.data.payload, true);
        next();
      })
      .catch(() =>  next('/login1'));
    next();
  } else {
    next('/login1');
  }
};

export const checkJwt = (next) => {
  if (store.state.auth.jwtToken) {
    next();
  } else {
    checkRemeberme(next);
  }
};

export const checkAdmin = (next) => {
  if (store.state.auth.jwtToken) {
    if (store.state.auth.userCategory !== 'admin') {
      next('/');
    } else {
      next();
    }
  } else {
    checkRemeberme(next);
  }
};
