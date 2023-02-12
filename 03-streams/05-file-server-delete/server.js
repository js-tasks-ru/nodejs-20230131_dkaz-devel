const url = require('url');
const http = require('http');
const path = require('path');
const fs = require("fs");

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Incorrect path')
  } else {
    switch (req.method) {
      case 'DELETE':
        fs.unlink(filepath, (err) => {
          if (err && err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('No such file or directory')
          } else if (err) {
            res.statusCode = 500;
            res.end('Internal server error')
          } else {
            res.statusCode = 200;
            res.end('Deleted')
          }
        })

        break;

      default:
        res.statusCode = 501;
        res.end('Not implemented');
    }
  }
});

module.exports = server;
