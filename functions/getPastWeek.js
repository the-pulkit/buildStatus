const dynamodb = require('../helpers/dynamodb')

/**
 * @param {string} url
 * @returns {any}
 */
module.exports = async (url, context) => {
  let currentDate = new Date().getTime()
  let today = new Date().setUTCHours(0, 0, 0, 0)
  let lastWeek = new Date(today - 7 * 24 * 60 * 60 * 1000).getTime() // midnight 7 days ago

  let filter = {
    KeyConditionExpression: '#endpoint = :url and #timestamp BETWEEN :lastWeek AND :currentTime',
    ExpressionAttributeNames: {
      '#endpoint': 'endpoint',
      '#timestamp': 'timestamp'
    },
    ExpressionAttributeValues: {
      ':url': url,
      ':lastWeek': lastWeek,
      ':currentTime': currentDate
    }
  }
  return dynamodb.query(filter)
}
