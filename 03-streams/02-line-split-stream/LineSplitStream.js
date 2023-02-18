const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.result = [];
  }

  _transform(chunk, encoding, callback) {
    const chunkArr = chunk.toString().split(``);

    chunkArr.forEach((chunkEl) => {
      if (chunkEl === `${os.EOL}`) {
        this.push(this.result.join(''))
        this.result = [];
      } else {
        this.result.push(chunkEl)
      }
    })
    callback()
  }


  _flush(callback) {
    if (this.result.length > 0) {
      this.push(this.result.join(''))
      this.result=[]
    }
    callback()
  }
}

module.exports = LineSplitStream;

