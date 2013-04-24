var test = require("tape")
var send = require("..")
var testServer = require("test-server")
var sendJson = require("../json")
var sendHtml = require("../html")

testServer(handleRequest, startTest)

function handleRequest(req, res) {
    if (req.url === "/send") {
        send(req, res, {
            body: "foo",
            statusCode: 202,
            headers: {
                bar: "baz"
            }
        })
    } else if (req.url === "/optional") {
        send(req, res, "foo")
    } else if (req.url === "/json") {
        sendJson(req, res, {
            body: {
                foo: "bar"
            },
            statusCode: 201
        })
    } else if (req.url === "/json/optional") {
        sendJson(req, res, {
            foo: "bar"
        })
    } else if (req.url === "/html") {
        sendHtml(req, res, {
            body: "<div>foo</div>",
            statusCode: 200,
            headers: {}
        })
    } else if (req.url === "/html/optional") {
        sendHtml(req, res, "<div>foo</div>")
    }
}

function startTest(request, done) {
    test("send", function (t) {
        request("/send", function (err, res, body) {
            t.equal(body, "foo")
            t.equal(res.statusCode, 202)
            t.equal(res.headers.bar, "baz")

            t.end()
        })
    })

    test("optional", function (t) {
        request("/optional", function (err, res, body) {
            t.equal(body, "foo")
            t.equal(res.statusCode, 200)

            t.end()
        })
    })

    test("json", function (t) {
        request("/json", function (err, res, body) {
            var data = JSON.parse(body)

            t.equal(data.foo, "bar")
            t.equal(res.statusCode, 201)
            t.equal(res.headers["content-type"], "application/json")

            t.end()
        })
    })

    test("json-optional", function (t) {
        request("/json/optional", function (err, res, body) {
            var data = JSON.parse(body)

            t.equal(data.foo, "bar")
            t.equal(res.statusCode, 200)
            t.equal(res.headers["content-type"], "application/json")

            t.end()
        })
    })

    test("html", function (t) {
        request("/html", function (err, res, body) {
            t.equal(body, "<div>foo</div>")
            t.equal(res.statusCode, 200)
            t.equal(res.headers["content-type"], "text/html")

            t.end()
        })
    })

    test("html-optional", function (t) {
        request("/html/optional", function (err, res, body) {
            t.equal(body, "<div>foo</div>")
            t.equal(res.statusCode, 200)
            t.equal(res.headers["content-type"], "text/html")

            t.end()
        })
    })

    .on("end", done)
}
