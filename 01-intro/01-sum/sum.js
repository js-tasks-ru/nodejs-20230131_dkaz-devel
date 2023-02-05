function sum(a, b) {

 if (a !== +a || b !== +b) {
     throw new TypeError()
 }

 return a + b;
}

module.exports = sum;
