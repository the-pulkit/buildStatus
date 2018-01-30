const ejs = require('ejs');
const lib = require('lib');
const path = require('path');

const getLogsAndUpTime = require('../helpers/getLogsAndUpTime');
const templatePath = path.join(__dirname, '/../static/components/service.ejs');

/**
 * @param {string} url
 * @param {string} displayName
 * @param {boolean} isLastService
 * @returns {buffer}
 */
module.exports = (
  url = 'https://api.polybit.com',
  displayName = 'StdLib API',
  isLastService,
  context,
  callback
) => {
  lib[`${context.service.identifier}.getPastWeek`](url)
    .then(results => {
      let [logs, upTime] = getLogsAndUpTime(results);

      url = url.replace(/(^\w+:|^)\/\//, '');
      if (url.indexOf('/') !== -1) {
        url = url.slice(0, url.indexOf('/'));
      }

      let templateVars = {
        url: url,
        displayName: displayName,
        logs: logs,
        upTime: upTime,
        latencyThreshold: process.env.LATENCY_THRESHOLD,
        isLastService: isLastService
      };

      ejs.renderFile(templatePath, templateVars, {}, (err, data) => {
        return callback(err, Buffer.from(data || ''), { 'Content-Type': 'text/html' });
      });
    })
    .catch(err => {
      return callback(err);
    });
};
