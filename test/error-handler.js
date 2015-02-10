'use strict';

var test = require('tape');
var http = require('http');
var sendError = require('../error.js');
var MockRequest = require('hammock').Request;
var MockResponse = require('hammock').Response;
var hammockRequest = require('hammock-request');
var extend = require('xtend');

test('handler should append params to expected error', function t(assert) {
    var req = MockRequest({
        url: 'www.google.com'
    });
    var res = MockResponse();

    res.on('end', function verify(err, data) {
        assert.ifError(err);

        var json = JSON.parse(data.body);
        assert.equal(json.errorCode, 2000);
    });

    var myError = {
        expected: true,
        message: 'hello world!',
        statusCode: 123,
        errorCode: 2000
    };

    sendError(req, res, {
        body: myError,
        additionalParams: ['errorCode']
    });
    assert.end();
});

test('handler should append params to expected error', function t(assert) {
    var req = MockRequest({
        url: 'www.google.com'
    });
    var res = MockResponse();

    res.on('end', function verify(err, data) {
        assert.ifError(err);

        var json = JSON.parse(data.body);
        assert.equal(json.errorCode, 2000);
    });

    var myError = {
        expected: false,
        message: 'hello world!',
        statusCode: 123,
        errorCode: 2000
    };

    sendError(req, res, {
        body: myError,
        additionalParams: ['errorCode']
    });
    assert.end();
});

function makeServer(opts, handler) {
    if (typeof opts === 'function') {
        handler = opts;
        opts = {};
    }

    var server = http.createServer();

    server.on('request', onRequest);

    return server;

    function onRequest(req, res) {
        handler(req, res, {}, onHandled);

        function onHandled(err) {
            if (err) {
                sendError(req, res, extend(opts, {
                    body: err
                }));
            }
        }
    }
}

test('error handler', function t(assert) {
    var s = makeServer(function onReq(req, res, o, cb) {
        cb(new Error('test'));
    });

    hammockRequest(s, {
        url: '/foo',
        json: true
    }, function onResp(err, resp) {
        assert.ifError(err);

        assert.equal(resp.statusCode, 500);
        assert.equal(resp.body.message, 'test');
        assert.equal(resp.body.statusCode, 500);

        assert.end();
    });
});

test('send an expected error', function t(assert) {
    var s = makeServer(function onReq(req, res, o, cb) {
        var err = new Error('test');
        err.expected = true;
        cb(err);
    });

    hammockRequest(s, {
        url: '/foo',
        json: true
    }, function onResp(err, resp) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 500);
        var b = resp.body;
        assert.equal(b.message, 'test');
        assert.equal(b.statusCode, 500);

        assert.end();
    });
});

test('send error with bodyStatusCode', function t(assert) {
    var s = makeServer({
        bodyStatusCode: false
    }, function onReq(req, res, o, cb) {
        var err = new Error('test');
        cb(err);
    });

    hammockRequest(s, {
        url: '/foo',
        json: true
    }, function onResp(err, resp) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 500);
        var b = resp.body;
        assert.equal(b.message, 'test');
        assert.equal(b.statusCode, undefined);

        assert.end();
    });
});

test('send expected error with bodyStatusCode', function t(assert) {
    var s = makeServer({
        bodyStatusCode: false
    }, function onReq(req, res, o, cb) {
        var err = new Error('test');
        err.expected = true;
        cb(err);
    });

    hammockRequest(s, {
        url: '/foo',
        json: true
    }, function onResp(err, resp) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 500);
        var b = resp.body;
        assert.equal(b.message, 'test');
        assert.equal(b.statusCode, undefined);

        assert.end();
    });
});

test('send an error with verbose', function t(assert) {
    var s = makeServer({
        verbose: true
    }, function onReq(req, res, o, cb) {
        var err = new Error('test');
        cb(err);
    });

    hammockRequest(s, {
        url: '/foo',
        json: true
    }, function onResp(err, resp) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 500);
        var b = resp.body;
        assert.equal(b.message, 'test');
        assert.notok(b.stack);

        assert.end();
    });
});

test('serializes stack only when told to do so', function t(assert) {
    function requestFoo(assertions) {
        var s = makeServer({
            verbose: true,
            serializeStack: true
        }, function onReq(req, res, o, cb) {
            var err = new Error('test');
            err.expected = 'expected';
            err.debug = 'debug';
            cb(err);
        });

        hammockRequest(s, {
            url: '/foo',
            json: true
        }, assertions);
    }

    requestFoo(function onFoo(err, resp) {
        var b = resp.body;
        assert.ok(b.stack);
        assert.end();
    });
});

test('send an expected error with verbose', function t(assert) {
    var s = makeServer({
        verbose: true
    }, function onReq(req, res, o, cb) {
        var err = new Error('test');
        err.expected = true;
        cb(err);
    });

    hammockRequest(s, {
        url: '/foo',
        json: true
    }, function onResp(err, resp) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 500);
        var b = resp.body;
        assert.equal(b.message, 'test');
        assert.notok(b.stack);

        assert.end();
    });
});

test('send error without statsd', function t(assert) {
    var s = makeServer(function onReq(req, res, o, cb) {
        cb(new Error('test'));
    });

    hammockRequest(s, {
        url: '/foo',
        json: true
    }, function onResp(err, resp) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 500);
        var b = resp.body;
        assert.equal(b.message, 'test');
        assert.equal(b.statusCode, 500);

        assert.end();
    });
});

test('send expected error without statsd', function t(assert) {
    var s = makeServer(function onReq(req, res, o, cb) {
        var err = new Error('test');
        err.expected = true;
        cb(err);
    });

    hammockRequest(s, {
        url: '/foo',
        json: true
    }, function onResp(err, resp) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 500);
        var b = resp.body;
        assert.equal(b.message, 'test');
        assert.equal(b.statusCode, 500);

        assert.end();
    });
});

test('send error with weird statusCode', function t(assert) {
    var s = makeServer(function onReq(req, res, o, cb) {
        var err = new Error('test');
        err.statusCode = 5001;
        cb(err);
    });

    hammockRequest(s, {
        url: '/foo',
        json: true
    }, function onResp(err, resp) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 5001);
        var b = resp.body;
        assert.equal(b.message, 'test');
        assert.equal(b.statusCode, 5001);

        assert.end();
    });
});

test('send error with empty message', function t(assert) {
    var s = makeServer({
        verbose: true
    }, function onReq(req, res, o, cb) {
        var err = new Error('');
        cb(err);
    });

    hammockRequest(s, {
        url: '/foo',
        json: true
    }, function onResp(err, resp) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 500);
        var b = resp.body;
        assert.equal(b.message, 'Internal Server Error');
        assert.equal(b.statusCode, 500);

        assert.end();
    });
});

test('send expected error with type', function t(assert) {
    var s = makeServer(function onReq(req, res, o, cb) {
        var err = new Error('test');
        err.expected = true;
        err.type = 'foo';
        cb(err);
    });

    hammockRequest(s,{
        url: '/foo',
        json: true
    }, function onResp(err, resp) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 500);
        var b = resp.body;
        assert.equal(b.message, 'test');
        assert.equal(b.statusCode, 500);
        assert.equal(b.type, 'foo');

        assert.end();
    });
});

test('send expected error with messages', function t(assert) {
    var s = makeServer(function onReq(req, res, o, cb) {
        var err = new Error('test');
        err.expected = true;
        err.messages = ['foo'];
        cb(err);
    });

    hammockRequest(s, {
        url: '/foo',
        json: true
    }, function onResp(err, resp) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 500);
        var b = resp.body;
        assert.equal(b.message, 'test');
        assert.equal(b.statusCode, 500);
        assert.deepEqual(b.messages, ['foo']);

        assert.end();
    });
});

test('send expected error with no message', function t(assert) {
    var s = makeServer(function onReq(req, res, o, cb) {
        var err = new Error('');
        err.expected = true;
        cb(err);
    });

    hammockRequest(s, {
        url: '/foo',
        json: true
    }, function onResp(err, resp) {
        assert.ifError(err);
        assert.equal(resp.statusCode, 500);
        var b = resp.body;
        assert.equal(b.message, 'Internal Server Error');
        assert.equal(b.statusCode, 500);

        assert.end();
    });
});

test('send expected error + weird statusCode', function t(assert) {
    var s = makeServer(function onReq(req, res, o, cb) {
        var err = new Error('');
        err.expected = true;
        err.statusCode = 5001;
        cb(err);
    });

    hammockRequest(s, {
        url: '/foo',
        json: true
    }, function onResp(err, resp) {
        assert.equal(resp.statusCode, 5001);
        var b = resp.body;
        assert.equal(b.message, 'Internal Server Error');
        assert.equal(b.statusCode, 5001);

        assert.end();
    });
});
