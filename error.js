'use strict';

var url = require('url');
var assert = require('assert');
var STATUS_CODES = require('http').STATUS_CODES;

var sendJson = require('./json.js');

module.exports = sendError;

function sendError(req, res, opts, callback) {
    assert(opts && opts.body, 'opts.body is required');

    var err = opts.body;
    var logger = opts.logger;
    var statsd = opts.statsd;
    var verbose = opts.verbose;

    var errOpts = {
        verbose: typeof verbose === 'boolean' ? verbose : true,
        serializeStack: opts.serializeStack,
        bodyStatusCode: opts.bodyStatusCode,
        additionalParams: opts.additionalParams,
        err: err
    };

    var statsPrefix = opts.statsPrefix || 'clients.send-data';
    var parsedUrl = url.parse(req.url);
    var statsdKey = statsPrefix + '.error-handler';

    var isExpected = err.expected ||
        (err.statusCode >= 400 && err.statusCode <= 499);

    if (!isExpected) {
        if (logger) {
            logger.error('unexpected error', err);
        }
        if (statsd) {
            statsd.increment(statsdKey + '.unexpected');
        }
    } else if (statsd) {
        statsd.increment(statsdKey + '.expected');
    }
    writeError(req, res, errOpts, callback);
}

function writeError(req, res, opts, callback) {
    var err = opts.err;
    var statusCode = err.statusCode || 500;
    var body = {
        message: err.message || STATUS_CODES[statusCode] ||
            STATUS_CODES[500]
    };

    if (typeof err.type === 'string') {
        body.type = err.type;
    }

    if (Array.isArray(err.messages)) {
        body.messages = err.messages;
    }

    // Toggle sending status code in the body
    if (opts.bodyStatusCode !== false) {
        body.statusCode = statusCode;
    }

    if (opts.verbose) {
        body.expected = err.expected;
        body.debug = err.debug;
    }

    if (opts.serializeStack) {
        body.stack = err.stack;
    }

    // Append additional params
    if (opts.additionalParams) {
        opts.additionalParams.forEach(function appendKey(k) {
            body[k] = err[k];
        });
    }

    sendJson(req, res, {
        statusCode: statusCode,
        body: body
    }, callback);
}
