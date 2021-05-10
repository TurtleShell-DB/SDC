const axios = require('axios');
const API_KEY = require('../config.js');
const baseURL = require('./AtelierConfig.js');
const productsURL = require('./AtelierConfig.js');

const overviewHandler = (productID, errorCB, successCB) => {
  const productData = {};
  axios({
    method: 'get',
    url: `${productsURL}/products/${productID}`,
    headers: { Authorization: API_KEY },
  })
    .then((response) => {
      productData.product = response.data;
      console.log('productid response api is ', response.data);
      return axios({
        method: 'get',
        url: `${productsURL}/products/${productID}/styles`,
        headers: { Authorization: API_KEY },
      });
    })
    .then((response) => {
      productData.styles = response.data;
      console.log('product style response api is ', response.data);
      successCB(productData);
    })
    .catch((response) => {
      errorCB(response);
    });
};

module.exports = overviewHandler;
