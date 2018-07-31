/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */
var http2 = require('http2');
var HTTP2_HEADER_AUTHORITY = http2.constants.HTTP2_HEADER_AUTHORITY;
var decorator = require('./requestDecorator');
var http2Req = decorator(Object.create(http2.Http2ServerRequest.prototype));

/**
 * req.host and req.hostname refer to ':authority' haeder for compatibility.
 */

Object.defineProperty(http2Req, 'hostname', {
  configurable: true,
  enumerable: true,
  get: function hostname() {
    var trust = this.app.get('trust proxy fn');
    var host = this.get('X-Forwarded-Host');

    if (!host || !trust(this.connection.remoteAddress, 0)) {
      host = this.get(HTTP2_HEADER_AUTHORITY);
    }

    if (!host) return;

    // IPv6 literal support
    var offset = host[0] === '['
      ? host.indexOf(']') + 1
      : 0;
    var index = host.indexOf(':', offset);

    return index !== -1
      ? host.substring(0, index)
      : host;
  }
});

/**
 * Module exports.
 * @public
 */

module.exports = http2Req;
