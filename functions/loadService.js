const path = require('path')
const { promisify } = require('util')

const renderFile = promisify(require('ejs').renderFile)

const getData = require('../helpers/getData.js')
const templatePath = path.join(__dirname, '/../static/components/service.ejs')

let service

/**
 * @param {string} url
 * @param {string} displayName
 * @param {boolean} isLastService
 * @returns {object.http}
 */
module.exports = async (url, displayName, isLastService, context) => {
  let [logs, upTime] = await getData();

  url = url.replace(/(^\w+:|^)\/\//, '')
  if (url.indexOf('/') !== -1) {
    url = url.slice(0, url.indexOf('/'))
  }

  let templateVars = {
    url: url,
    displayName: displayName,
    logs: logs,
    upTime: upTime,
    latencyThreshold: 350,
    isLastService: isLastService
  }

  console.log(templateVars)

  service = service || (await renderFile(templatePath, templateVars))

  return {
    headers: {
      'Content-Type': 'text/html'
    },
    body: service,
    statusCode: 200
  }
}
