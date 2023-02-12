const url = require('url');
const http = require('http');
const path = require('path');
const fs = require("fs");
const LimitSizeStream = require("./LimitSizeStream");

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Incorrect path')
  } else if (fs.existsSync(filepath)) {
    res.statusCode = 409;
    res.end('File already exists')
  } else {
    switch (req.method) {
      case 'POST':
        const file = fs.createWriteStream(filepath);
        const limitStream = new LimitSizeStream({limit: 1048576})

        limitStream.pipe(file)

        req.on('data', data => {
          limitStream.write(data)
        })

        req.on('end', ()=> {
          limitStream.end()
        })

        limitStream.on('error', err => {
          deleteFile()
          res.statusCode = 413;
          res.end(err.code)
        })

        file.on('error', err => {
          deleteFile()
          res.statusCode = 500;
          res.end('Something went wrong')
        })

        limitStream.on('end', () => {
          res.statusCode = 201;
          res.end('Created')
        })

        req.on('aborted', () => {
          deleteFile()
        })

        break;

      default:
        res.statusCode = 501;
        res.end('Not implemented');
    }
  }

  function deleteFile() {
    return fs.unlink(filepath, (err) =>{
      if (err) {
        throw err
      }
    })
  }

});

module.exports = server;
