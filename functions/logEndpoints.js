const dynamodb = require('../helpers/dynamodb');
const pingEndpoint = require('../helpers/pingEndpoint');

/**
 * @param {array} urls
 * @param {string} key
 * @returns {any}
 */
module.exports = async (urls, key, context) => {
  if (key !== process.env.AUTH_KEY) {
    throw new Error('Invalid auth key');
  }

  let requests = await Promise.all(urls.map(url => pingEndpoint(url)));
  return Promise.all(requests.map(item => dynamodb.addItem(item)));
};
