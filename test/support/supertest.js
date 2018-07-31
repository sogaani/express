var request = require('supertest')
if (process.env.HTTP2_TEST) {
  request.http2 = true
}

module.exports = request
