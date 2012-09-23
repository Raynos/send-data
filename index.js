var forEach = require("iterators").forEachSync

module.exports = send

send.json = sendJson
send.html = sendHtml

function sendJson(req, res, data) {
    if (!data.statusCode && !data.headers) {
        data = { data: data }
    }

    data.headers = data.headers || {}
    data.data = JSON.stringify(data.data)
    data.headers["content-type"] = "application/json"

    send(req, res, data)
}

function sendHtml(req, res, data) {
    if (typeof data !== "object") {
        data = { data: data }
    }

    data.headers = data.headers || {}
    data.headers["content-type"] = "text/html"

    send(req, res, data)
}

function send(req, res, data) {
    var statusCode
        , headers = {}

    if (typeof data === "object") {
        statusCode = data.statusCode
        headers = data.headers || {}
        data = data.data
    }

    if (!Buffer.isBuffer(data)) {
        data = new Buffer(data)
    }

    headers["content-length"] = data.length

    res.statusCode = statusCode || res.statusCode || 200

    forEach(headers, writeHeader, res)

    res.end(data)
}

function writeHeader(value, headerName) {
    this.setHeader(headerName, value)
}