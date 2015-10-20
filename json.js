'use strict';

// var stringify = require('json-stringify-safe')

var extend = require('xtend');

var send = require('./index')
var isSendObject = require('./is-send-object')

var CONTENT_TYPE_HEADER = {
    'content-type': 'application/json'
}

module.exports = sendJson

function sendJson(req, res, opts, callback) {
    if (!isSendObject(opts)) {
        opts = { body: opts }
    } else {
        opts = extend(opts);
    }

    if (opts.pretty) {
        opts.space = '    '
    }

    var tuple = safeStringify(opts.body,
        opts.replacer || null, opts.space || '');

    if (tuple[0]) {
        return callback(tuple[0]);
    }

    opts.headers = extend(opts.headers, CONTENT_TYPE_HEADER);
    opts.body = tuple[1];

    send(req, res, opts, callback)
}

function safeStringify(obj, replace, space) {
    var json;
    var error = null;

    try {
        json = JSON.stringify(obj, replace, space);
    } catch (e) {
        error = e;
    }

    return [error, json];
}
