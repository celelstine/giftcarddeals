import axios from 'axios';
import * as types from '../mutation-types';
/* eslint-disable no-shadow  */

// initial state
const state = {
  message: null,
  emails: [],
};

// getters
const getters = {
  message: state => state.message,
  emails: state => state.emails,
};

// actions
const actions = {
  addEmail({ commit }, credentails) {
    commit(types.ADDING_EMAIL, {});
    axios.post('/api/v1/staffEmail', credentails)
      .then((response) => {
        const { data } = response;
        commit(types.ADD_EMAIL_SUCCESS, { ...data });
      })
      .catch((error) => {
        let message = 'An internal error occurred, please try again';
        if (error.response.status && error.response.status !== 500) {
          message = error.response.data.message;
        }
        return commit(types.EMAIL_FAILURE, { message });
      });
  },
  removeEmail({ commit }, { email }) {
    commit(types.DELETING_EMAILS, {});
    axios.delete(`/api/v1/staffEmail/${email}`)
      .then((response) => {
        const { data } = response;
        commit(types.DELETE_EMAILS_SUCCESS, { ...data });
      })
      .catch((error) => {
        let message = 'An internal error occurred, please try again';
        if (error.response.status && error.response.status !== 500) {
          message = error.response.data.message;
        }
        return commit(types.EMAIL_FAILURE, { message });
      });
  },
  getEmails({ commit }) {
    commit(types.GETTING_EMAILS, {});
    axios.get('/api/v1/staffEmail')
      .then((response) => {
        const { data } = response;
        commit(types.GET_EMAILS_SUCCESS, { ...data });
      })
      .catch((error) => {
        let message = 'An internal error occurred, please try again';
        if (error.response.status && error.response.status !== 500) {
          message = error.response.data.message;
        }
        return commit(types.EMAIL_FAILURE, { message });
      });
  },
};

// mutations
const mutations = {
  [types.ADDING_EMAIL](state) {
    state.message = 'Registering the email...';
  },
  [types.ADD_EMAIL_SUCCESS](state, { email }) {
    state.message = null;
    state.emails = [email, ...state.emails];
  },
  [types.GETTING_EMAILS](state) {
    state.message = 'Fetching emails';
  },
  [types.GET_EMAILS_SUCCESS](state, { emails }) {
    state.message = null;
    state.emails = emails;
  },
  [types.DELETING_EMAILS](state) {
    state.message = 'Deleting emails';
  },
  [types.DELETE_EMAILS_SUCCESS](state, { email }) {
    state.message = null;
    const emails = state.emails.filter(curEmail =>
      curEmail !== email);
    state.emails = emails;
  },
  [types.EMAIL_FAILURE](state, { message }) {
    if (message) {
      state.message = message;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
