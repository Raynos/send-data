'use strict';

var extend = require('xtend');

var send = require('./index')

var CONTENT_TYPE_HEADER = {
    'content-type': 'text/plain; charset=utf-8'
}

module.exports = sendPlain

function sendPlain(req, res, opts, callback) {
    if (typeof opts === 'string' || Buffer.isBuffer(opts)) {
        opts = { body: opts }
    } else {
        opts = extend(opts);
    }

    opts.headers = extend(opts.headers, CONTENT_TYPE_HEADER);

    send(req, res, opts, callback)
}
