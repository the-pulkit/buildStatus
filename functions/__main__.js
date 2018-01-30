const ejs = require('ejs');
const path = require('path');

const templatePath = path.join(__dirname, '/../static/components/index.ejs');
const URLS = [
  {
    displayName: 'API',
    url: 'https://api.polybit.com'
  },
  {
    displayName: 'Dotcom',
    url: 'https://www.stdlib.com'
  }
];

/**
 * @returns {buffer}
 */
module.exports = (context, callback) => {
  let templateVars = {
    displayNames: URLS.map(url => url.displayName),
    services: URLS.map(url => url.url),
    servicePath: context.service.identifier,
    title: process.env.TITLE,
    mainPageURL: process.env.MAIN_PAGE_URL,
    logoURL: process.env.LOGO_URL
  };

  ejs.renderFile(templatePath, templateVars, {}, (err, data) => {
    return callback(err, Buffer.from(data || ''), { 'Content-Type': 'text/html' });
  });
};
