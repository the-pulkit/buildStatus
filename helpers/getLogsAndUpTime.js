const chunkArray = (arr, len) => {
  if (len <= 0) {
    return arr
  }
  let chunks = []
  let i = 0
  while (i < arr.length) {
    chunks.push(arr.slice(i, (i += len)))
  }
  return chunks
}

// Averages latency and gets 'worst' (highest) response code for the hour
const summarizeHour = array => {
  let sum = array.reduce((acc, log) => {
    acc.latency += ((log.latency.firstResponse || 0) + (log.latency.total || 0))
    acc.responseCode = Math.max(acc.responseCode, log.responseCode)
    return acc
  }, {
    latency: 0,
    responseCode: 0
  })
  sum.latency = sum.latency / array.length
  return sum
}

const toDay = service => {
  let days = chunkArray(service, 24)
  return days
}

const toHour = service => {
  let hours = chunkArray(service, 12).map(summarizeHour)
  let currentHour = new Date().getHours()

  while (hours.length < 145 + currentHour) {
    hours.unshift(null)
  }

  return hours
}

const getUpTime = service => {
  let upTime = service.reduce(
    (acc, log) => {
      if (log.responseCode === 200) {
        acc[0] = acc[0] + 1
        return acc
      }
      acc[1] = acc[1] + 1
      return acc
    },
    [0, 0]
  )
  return Math.floor(upTime[0] / (upTime[0] + upTime[1])) * 100
}

const getLogsAndUpTime = data => {
  let service = data.Items
  let upTime = getUpTime(service)

  let lastHour = new Date().getHours() + 1
  let numLogs = 12 * 24 * 6 + lastHour * 12

  service = service.slice(-numLogs)
  service = toDay(toHour(service))
  return [service, upTime]
}

module.exports = getLogsAndUpTime
