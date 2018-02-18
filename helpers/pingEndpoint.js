const pingEndpoint = url => {
  return new Promise((resolve, reject) => {
    const httpLib = url.startsWith('https') ? require('https') : require('http')

    const timer = {
      start: new Date().valueOf(),
      firstResponse: null,
      end: null
    }

    const request = httpLib.get(url, response => {
      timer.firstResponse = new Date().valueOf()
      const responseCode = response.statusCode

      if (response.responseCode < 200 || response.responseCode > 399) {
        resolve({
          endpoint: url,
          timestamp: timer.start,
          responseCode: responseCode
        })
      }

      let body = []

      response.on('data', chunk => {
        let now = new Date().valueOf

        if (now - timer.start > 30000) {
          // 30 second timout
          resolve({
            endpoint: url,
            timestamp: timer.start,
            responseCode: 504
          })
        }

        body.push(chunk)
      })

      response.on('end', () => {
        timer.end = new Date().valueOf()
        resolve({
          endpoint: url,
          timestamp: timer.start,
          responseCode: responseCode,
          latency: {
            total: timer.end - timer.firstResponse,
            firstResponse: timer.firstResponse - timer.start
          }
        })
      })
    })

    request.on('error', err => reject(err))
  })
}

module.exports = pingEndpoint
