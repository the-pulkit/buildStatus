const path = require('path')
const { promisify } = require('util')

const renderFile = promisify(require('ejs').renderFile)

const templatePath = path.join(__dirname, '/../static/components/index.ejs')

const getURLS = require('../helpers/getURLs');

let app

/**
 * @returns {object.http}
 */
module.exports = async (context) => {
  const URLS = await getURLS();
  let templateVars = {
    displayNames: URLS.map(url => url.displayName),
    services: URLS.map(url => url.url),
    ids: URLS.map(url => url.id),
    servicePath: context.service.identifier,
    title: 'Status',
    mainPageURL: process.env.MAIN_PAGE_URL,
    logoURL: "https://stdlib.com/static/images/standard-library-logo-wordmark.svg"
  }

  app = app || await renderFile(templatePath, templateVars)

  return {
    headers: {
      'Content-Type': 'text/html'
    },
    body: app,
    statusCode: 200
  }
}
