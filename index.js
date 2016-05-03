'use strict';

var Buffer = require('buffer').Buffer
var zlib = require('zlib')

var CALLBACK_REQUIRED = 'send(req, res, opts, callback). Callback is required'
var isGzip = /\bgzip\b/

module.exports = send

function send(req, res, opts, callback) {
    var headers = opts.headers || {}
    var statusCode = opts.statusCode || null
    var body = typeof opts === 'object' ? opts.body : opts
    var gzip = opts.gzip || false

    body = Buffer.isBuffer(body) ? body : new Buffer(body || '')
    headers = headers || {}

    res.statusCode = statusCode || res.statusCode

    Object.keys(headers).forEach(function (header) {
        setHeader(res, header, headers[header])
    })

    if (gzip && acceptsGzip(req)) {
        if (!callback) {
            throw new Error(CALLBACK_REQUIRED)
        }

        zlib.gzip(body, function (err, body) {
            if (err) {
                return callback(err)
            }

            res.once('finish', callback)

            setHeader(res, 'content-encoding', 'gzip')
            setHeader(res, 'content-length', body.length)
            res.end(body)
        })
    } else {
        if (callback) {
            res.once('finish', callback)
        }

        setHeader(res, 'content-length', body.length)
        res.end(body)
    }
}

function acceptsGzip(req) {
    var acceptEncoding = req.headers['accept-encoding'] || ''

    return !!acceptEncoding.match(isGzip)
}

function setHeader (res) {
    if (res.headersSent) return
    res.setHeader.apply(res, [].slice.call(arguments, 1))
}
