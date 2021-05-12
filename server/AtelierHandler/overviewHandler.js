const axios = require('axios');
const API_KEY = require('../config.js');
const baseURL = require('./AtelierConfig.js');
const productUrl = require('./DatabaseConfig.js');


const overviewHandler = (productID, errorCB, successCB) => {
  const productData = {};
  axios({
    method: 'get',
    url: `${productUrl}/products/${productID}`,
    headers: { Authorization: API_KEY },
  })
    .then((response) => {
      productData.product = response.data;
      return axios({
        method: 'get',
        url: `${productUrl}/products/${productID}/styles`,
        headers: { Authorization: API_KEY },
      });
    })
    .then((response) => {
      productData.styles = response.data;
      // console.log('response for styles is ', productData);
      successCB(productData);
    })
    .catch((response) => {
      errorCB(response);
    });
};

module.exports = overviewHandler;
