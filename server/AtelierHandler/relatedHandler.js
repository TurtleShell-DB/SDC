const axios = require('axios');
const API_KEY = require('../config.js');
const baseURL = require('./AtelierConfig.js');
const productsURL = require('./AtelierConfig.js');

const informationHandler = (productID, errorCB, successCB) => {
  const productData = {};
  let infoLength = 0;
  let styleLength = 0;
  let reviewLength = 0;
  axios({
    method: 'get',
    url: `${productsURL}/products/${productID}/related`,
    headers: { Authorization: API_KEY },
  })
    .then((response) => {
      console.log('product reviews to related products data from server is ', response.data);
      productData.related = {};
      productData.related.relatedIds = response.data;
      const relatedInformationRequests = productData.related.relatedIds.map((id) => axios({
        method: 'get',
        url: `${productsURL}/products/${id}`,
        headers: { Authorization: API_KEY },
      }));
      const relatedStyleRequests = productData.related.relatedIds.map((id) => axios({
        method: 'get',
        url: `${productsURL}/products/${id}/styles`,
        headers: { Authorization: API_KEY },
      }));
      const relatedReviewRequests = productData.related.relatedIds.map((id) => axios({
        method: 'get',
        url: `${baseURL}/reviews?product_id=${id}&sort=newest&count=100&page=1`,
        headers: { Authorization: API_KEY },
      }));
      infoLength = relatedInformationRequests.length;
      styleLength = relatedStyleRequests.length;
      reviewLength = relatedReviewRequests.length;
      return axios.all(relatedInformationRequests.concat(relatedStyleRequests, relatedReviewRequests));
    })
    .then((response) => {
      productData.related.relatedInformation = [];
      productData.related.relatedStyles = [];
      productData.related.relatedReviews = [];
      for (let i = 0; i < infoLength; i += 1) {
        productData.related.relatedInformation.push(response[i].data);
      }
      for (let i = infoLength; i < infoLength + styleLength; i += 1) {
        productData.related.relatedStyles.push(response[i].data);
      }
      for (let i = infoLength + styleLength; i < infoLength + styleLength + reviewLength; i += 1) {
        productData.related.relatedReviews.push(response[i].data);
      }
      successCB(productData);
    })
    .catch((response) => {
      errorCB(response);
    });
};

module.exports = informationHandler;
