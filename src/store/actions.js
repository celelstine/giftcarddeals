import axios from 'axios';
import * as types from './mutation-types';

export const registerProduct = ({ commit }, { formData }) => {
  commit(types.ADDING_PRODUCT, {});
  axios.post('/api/v1/products',
    formData,
    {
      headers: {
        'content-type': 'multipart/form-data',
      },
    },
  )
    .then((response) => {
      const { data } = response;
      commit(types.NEW_PRODUCT, { ...data });
    })
    .catch((error) => {
      let message = 'An internal error occurred, please try again';
      if (error.response.status && error.response.status !== 500) {
        message = error.response.data.message;
      }
      return commit(types.NEW_PRODUCT_FAILURE, { message });
    });
};

export const updateProduct = ({ commit }, { formData, productId }) => {
  commit(types.UPDATING_PRODUCT, {});
  axios.post(`/api/v1/products/${productId}`,
    formData,
    {
      headers: {
        'content-type': 'multipart/form-data',
      },
    },
  )
    .then((response) => {
      const { data } = response;
      commit(types.UPDATE_PRODUCT_SUCCESS, { ...data });
    })
    .catch((error) => {
      let message = 'An internal error occurred, please try again';
      let err = '';
      if (error.response.status && error.response.status !== 500) {
        message = error.response.data.message;
      }
      return commit(types.UPDATE_PRODUCT_FAILURE, { message });
    });
};


export const getProducts = ({ commit }) => {
  commit(types.GETTINGPRODUCTS, {});
  axios.get('/api/v1/ourRate')
    .then(response => commit(types.GETPRODUCTS, response.data.products))
    .catch((error) => {
      let message = 'An internal error occurred, please try again';
      if (error.response.status && error.response.status !== 500) {
        const errMessage = error.response.data.message;
        message = errMessage || message;
      }
      return commit(types.GETPRODUCTS_FAILURE, { message });
    });
};

export const sendFeedback = ({ commit }, credentials) => {
  commit(types.SENDING_FEEDBACK, {});
  axios.post('/api/v1/sendfeedback', credentials)
    .then(() => commit(types.SENDING_FEEDBACK_SUCCESS, {}))
    .catch((error) => {
      let message = 'An internal error occurred, please try again';
      if (error.response.status && error.response.status !== 500) {
        const errMessage = error.response.data.message;
        message = errMessage || message;
      }
      return commit(types.SENDING_FEEDBACK_FAILURE, { message });
    });
};
