const axios = require('axios');
const API_KEY = require('../config.js');
const baseURL = require('./AtelierConfig.js');
const productUrl = require('./DatabaseConfig.js');

const informationHandler = (productID, errorCB, successCB) => {
  const productData = {};
  let infoLength = 0;
  let styleLength = 0;
  let reviewLength = 0;
  axios({
    method: 'get',
    url: `${productUrl}/products/${productID}/related`,
    headers: { Authorization: API_KEY },
  })
    .then((response) => {
      productData.related = {};
      productData.related.relatedIds = response.data;
      console.log('this data from related handler is ', productData.related.relatedIds);
      const relatedInformationRequests = productData.related.relatedIds.map((id) => axios({
        method: 'get',
        url: `${productUrl}/products/${id}`,
        headers: { Authorization: API_KEY },
      }));
      const relatedStyleRequests = productData.related.relatedIds.map((id) => axios({
        method: 'get',
        url: `${productUrl}/products/${id}/styles`,
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
      // console.log('product data from related is ', productData);
      successCB(productData);
    })
    .catch((response) => {
      errorCB(response);
    });
};

module.exports = informationHandler;
