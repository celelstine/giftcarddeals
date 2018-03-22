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
      if (error.response.status && error.response.status !== 500) {
        message = error.response.data.message;
      }
      return commit(types.UPDATE_PRODUCT_FAILURE, { message });
    });
};


export const getProducts = ({ commit }) => {
  commit(types.GETTINGPRODUCTS, {});
  // const products = [
  //   {
  //     id: 3,
  //     name: 'skskb',
  //     acronym: 'tts',
  //     rate: 22,
  //     highDenominationRate: 34,
  //     isActive: true,
  //     image_url: 'productImages/IMG-20170425-WA0000.jpg',
  //     extra: 'null',
  //     cardCurrency: '$',
  //     createdAt: '2018-03-02T14:39:27.317Z',
  //     updatedAt: '2018-03-02T21:01:30.171Z',
  //   },
  //   {
  //     id: 1,
  //     name: 'Generic card',
  //     acronym: 'usi',
  //     rate: 33,
  //     highDenominationRate: 35,
  //     isActive: true,
  //     image_url: '../assets/images/itunes-gift-card-pile.png',
  //     extra: 'US gift card',
  //     cardCurrency: '$',
  //     createdAt: '2018-02-13T09:47:28.336Z',
  //     updatedAt: '2018-03-02T21:50:28.854Z',
  //   },
  //   {
  //     id: 2,
  //     name: 'testing',
  //     acronym: 'use',
  //     rate: 33,
  //     highDenominationRate: 40,
  //     isActive: true,
  //     image_url: 'productImages/itunes-gift-card-pile.png',
  //     extra: null,
  //     cardCurrency: '#',
  //     createdAt: '2018-02-15T14:42:37.959Z',
  //     updatedAt: '2018-02-15T14:42:37.959Z',
  //   },
  //   {
  //     id: 4,
  //     name: 'Generic card',
  //     acronym: 'oos',
  //     rate: 31,
  //     highDenominationRate: 35,
  //     isActive: true,
  //     image_url: 'productImages/IMG-20170425-WA0000.jpg',
  //     extra: 'US gift card',
  //     cardCurrency: '$',
  //     createdAt: '2018-02-13T09:47:28.336Z',
  //     updatedAt: '2018-03-02T21:49:53.448Z',
  //   },
  // ];
  // commit(types.GETPRODUCTS, products);
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

export const sendAdminFeedback = ({ commit }, { formData }) => {
  commit(types.SENDING_ADMIN_FEEDBACK, {});
  axios.post('/api/v1/adminFeedback',
    formData,
    {
      headers: {
        'content-type': 'multipart/form-data',
      },
    },
  )
    .then((response) => {
      const { data } = response;
      commit(types.SENT_ADMIN_FEEDBACK, { ...data });
    })
    .catch((error) => {
      let message = 'An internal error occurred, please try again';
      if (error.response.status && error.response.status !== 500) {
        message = error.response.data.message;
      }
      return commit(types.SEND_ADMIN_FEEDBACK_FAILURE, { message });
    });
};
