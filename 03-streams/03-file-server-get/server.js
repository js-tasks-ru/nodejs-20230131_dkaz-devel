const url = require('url');
const http = require('http');
const path = require('path');
const fs = require("fs");

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://localhost:3000/${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'test/fixtures', pathname);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Incorrect path')
  }

  switch (req.method) {
    case 'GET':
      const stream = fs.createReadStream(filepath);

      stream.on('error', err => {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('File is not found')
        } else {
          res.statusCode = 500;
          res.end('Something went wrong')
        }
      })

      stream.pipe(res);

      req.on('aborted', () => {
        stream.destroy()
      })

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }

});

module.exports = server;
