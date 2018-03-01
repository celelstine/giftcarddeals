import axios from 'axios';
import * as types from '../store/mutation-types';
import store from '../store';

export const logout = (commit, next) => {
  commit(types.LOGOUT);
  next('/');
};

export const checkRemeberme = (next, to) => {
  if (localStorage.getItem('32snksnsknskn')) {
    const rememberText = localStorage.getItem('32snksnsknskn');
    axios.post('/api/v1/getUserwithRememberMeToken', { rememberText })
      .then((response) => {
        localStorage.getItem('32snksnsknskn', response.data.payload.rememberText);
        store.dispatch('auth/remeberMeLogin', response.data.payload, true);
        next();
      })
      .catch(() => {
        if (to.fullPath !== '/') {
          next('/');
        } else {
          next();
        }
      });
    next();
  } else if (to.fullPath !== '/') {
    next('/');
  } else {
    next();
  }
};

export const checkJwt = (next, to) => {
  if (store.state.auth.jwtToken) {
    next();
  } else {
    checkRemeberme(next, to);
  }
};

export const checkAdmin = (next, to) => {
  if (store.state.auth.jwtToken) {
    if (store.state.auth.userCategory !== 'admin') {
      next('/');
    } else {
      next();
    }
  } else {
    checkRemeberme(next, to);
  }
};
