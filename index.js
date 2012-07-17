var forEach = require("iterators").forEachSync

module.exports = send

send.sendJson = sendJson
send.sendHtml = sendHtml

function sendJson(res, object, statusCode) {
    send(res, JSON.stringify(object), statusCode, {
        "content-type": "application/json"
    })
}

function sendHtml(res, data, statusCode) {
    send(res, data, statusCode, {
        "content-type": "text/html"
    })
}

function send(res, data, statusCode, headers) {
    if (typeof statusCode === "object") {
        headers = statusCode
        statusCode = null
    }

    if (!Buffer.isBuffer(data)) {
        data = new Buffer(data)
    }

    headers = headers || {}
    headers["content-length"] = data.length

    res.statusCode = statusCode || res.statusCode || 200

    forEach(headers, writeHeader, res)

    res.end(data)
}

function writeHeader(value, headerName) {
    this.setHeader(headerName, value)
}