const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.encoding = options.encoding;
    this.counter = 0;
  }

  _transform(chunk, encoding, callback) {
    for (let chunkEl = 0; chunkEl < chunk.length; chunkEl++) {
      this.counter++
    }

    if (this.counter <= this.limit) {
      callback(null, chunk)
    } else {
      callback(new LimitExceededError)
    }
  }

}

module.exports = LimitSizeStream;
