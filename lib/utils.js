const crypto = require("crypto");
module.exports = {
  makeID(length = 20) {
    return crypto.randomBytes(length / 2).toString('hex');
  }
}