const axios = require('axios');
const API_KEY = require('../config.js');
const baseURL = require('./AtelierConfig.js');
const productsURL = require('./AtelierConfig.js');

const reviewHandler = (productID, errorCB, successCB) => {
  const productData = {};
  axios(`${baseURL}/reviews?product_id=${productID}`, {
    // method: 'get',
    // url: `${baseURL}/reviews?product_id=${productID}&sort=newest&count=100&page=1`,
    headers: { Authorization: API_KEY },
  })
    .then((response) => {
      console.log('data from reviewHandler is ', response.data);
      productData.reviews = {};
      productData.reviews.reviews = response.data;
      return axios({
        method: 'get',
        url: `${baseURL}/reviews/meta?product_id=${productID}`,
        headers: { Authorization: API_KEY },
      });
    })
    .then((response) => {
      productData.reviews.reviewMeta = response.data;
      successCB(productData);
    })
    .catch((response) => {
      errorCB(response);
    });
};

module.exports = reviewHandler;
