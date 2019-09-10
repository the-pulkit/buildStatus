const fs = require('fs')
const path = require('path')

const mime = require('mime')

const filepath = './static'
let staticFiles = readFiles(filepath)

/**
 * Endpoint that serves static files.
 * @returns {object.http}
 */
module.exports = async (context) => {
  // Hot reload for local development
  if (context.service && context.service.environment === 'local') {
    staticFiles = readFiles(filepath)
  }

  let staticFilepath = path.join(...context.path.slice(1))
  let headers = {
    'Cache-Control': 'max-age=31536000'
  }

  if (!staticFiles[staticFilepath]) {
    return {
      headers: {
        ...headers,
        'Content-Type': 'text/plain'
      },
      body: '404 - Not Found',
      statusCode: 404
    }
  }

  return {
    headers: {
      ...headers,
      'Content-Type': mime.lookup(staticFilepath)
    },
    body: staticFiles[staticFilepath],
    statusCode: 200
  }
}

function readFiles (base, dir, files) {
  dir = dir || ''
  files = files || {}

  let pathname = path.join(base, dir)
  let dirList = fs.readdirSync(pathname)

  for (let i = 0; i < dirList.length; i++) {
    let dirpath = path.join(dir, dirList[i])
    let dirname = dirpath.split(path.sep).join('/')
    let fullpath = path.join(pathname, dirList[i])

    if (fs.lstatSync(fullpath).isDirectory()) {
      readFiles(base, dirpath, files)
    } else {
      files[dirname] = fs.readFileSync(fullpath)
    }
  }

  return files
}
