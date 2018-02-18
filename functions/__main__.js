const path = require('path')
const { promisify } = require('util')

const renderFile = promisify(require('ejs').renderFile)

const templatePath = path.join(__dirname, '/../static/components/index.ejs')

// Replace this with the endpoints you set the task for
const URLS = [
  {
    displayName: 'API',
    url: 'https://api.polybit.com'
  },
  {
    displayName: 'Dotcom',
    url: 'https://www.stdlib.com'
  }
]

let app

/**
 * @returns {object.http}
 */
module.exports = async (context) => {
  let templateVars = {
    displayNames: URLS.map(url => url.displayName),
    services: URLS.map(url => url.url),
    servicePath: context.service.identifier,
    title: process.env.TITLE,
    mainPageURL: process.env.MAIN_PAGE_URL,
    logoURL: process.env.LOGO_URL
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
