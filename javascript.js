'use strict';

var extend = require('xtend');

var send = require("./index")

module.exports = sendJavascript

var CONTENT_TYPE_HEADER = {
    "content-type": "text/javascript"
}

function sendJavascript(req, res, opts, callback) {
    if (typeof opts === "string" || Buffer.isBuffer(opts)) {
        opts = { body: opts }
    } else {
        opts = extend(opts);
    }

    opts.headers = extend(opts.headers, CONTENT_TYPE_HEADER);

    send(req, res, opts, callback)
}
