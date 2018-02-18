const path = require('path')
const promisify = require('util')

const lib = require('lib')
const renderFile = promisify(require('ejs').renderFile)

const getLogsAndUpTime = require('../helpers/getLogsAndUpTime')
const templatePath = path.join(__dirname, '/../static/components/service.ejs')

let service

/**
 * @param {string} url
 * @param {string} displayName
 * @param {boolean} isLastService
 * @returns {object.http}
 */
module.exports = async (url, displayName, isLastService, context) => {
  let data = await lib[`${context.service.identifier}.getPastWeek`](url)
  let [logs, upTime] = getLogsAndUpTime(data)

  url = url.replace(/(^\w+:|^)\/\//, '')
  if (url.indexOf('/') !== -1) {
    url = url.slice(0, url.indexOf('/'))
  }

  let templateVars = {
    url: url,
    displayName: displayName,
    logs: logs,
    upTime: upTime,
    latencyThreshold: process.env.LATENCY_THRESHOLD,
    isLastService: isLastService
  }

  service = service || (await renderFile(templatePath, templateVars))

  return {
    headers: {
      'Content-Type': 'text/html'
    },
    body: service,
    statusCode: 200
  }
}
