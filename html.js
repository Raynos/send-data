'use strict';

var Buffer = require('buffer').Buffer;
var extend = require('xtend');

var send = require('./index')

var CONTENT_TYPE_HEADER = {
    'content-type': 'text/html'
};

module.exports = sendHtml

function sendHtml(req, res, opts, callback) {
    if (typeof opts === 'string' || Buffer.isBuffer(opts)) {
        opts = { body: opts }
    } else {
        opts = extend(opts);
    }

    opts.headers = extend(opts.headers, CONTENT_TYPE_HEADER);

    send(req, res, opts, callback);
}
