const fs = require('fs');
const path = require('path');
const mime = require('mime');
const filepath = './static';
let staticFiles = readFiles(filepath);

function readFiles (base, dir, files) {
  dir = dir || '';
  files = files || {};
  let pathname = path.join(base, dir);

  let dirList = fs.readdirSync(pathname);

  for (let i = 0; i < dirList.length; i++) {
    let dirpath = path.join(dir, dirList[i]);
    let dirname = dirpath.split(path.sep).join('/');
    let fullpath = path.join(pathname, dirList[i]);
    if (fs.lstatSync(fullpath).isDirectory()) {
      readFiles(base, dirpath, files);
    } else {
      files[dirname] = fs.readFileSync(fullpath);
    }
  }

  return files;
}

/**
 * Endpoint that serves static files.
 * @returns {Buffer}
 */
module.exports = (context, callback) => {
  // Hot reload for local development
  if (context.service && context.service.environment === 'local') {
    staticFiles = readFiles(filepath);
  }

  if (context.params.env) {
    return callback(null, Buffer.from(`var env = ${JSON.stringify(process.env)};`), {
      'Content-Type': 'application/javascript'
    });
  }

  let staticFilepath = path.join(...context.path.slice(1));
  let buffer;
  let headers = {
    'Cache-Control': 'max-age=31536000'
  };

  if (!staticFiles[staticFilepath]) {
    headers['Content-Type'] = 'text/plain';
    buffer = Buffer.from('404 - Not Found');
  } else {
    headers['Content-Type'] = mime.lookup(staticFilepath);
    buffer = staticFiles[staticFilepath];
  }

  return callback(null, buffer, headers);
};
