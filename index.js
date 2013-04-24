var Buffer = require("buffer").Buffer

module.exports = send

/*  type SendData := Buffer | String | {
        headers?: Object<String, String>,
        body: Buffer | String,
        statusCode?: Number
    }
*/
// send := (HttpRequest, HttpResponse, SendData)
function send(req, res, body) {
    var headers
    var statusCode

    if (typeof body === "object") {
        statusCode = body.statusCode
        headers = body.headers
        body = body.body
    }

    body = Buffer.isBuffer(body) ? body : new Buffer(body)
    headers = headers || {}

    headers["Content-Length"] = body.length
    res.statusCode = statusCode || res.statusCode

    Object.keys(headers).forEach(function (header) {
        res.setHeader(header, headers[header])
    })
    res.end(body)
}

// module.exports = send

// send.json = sendJson
// send.html = sendHtml

// function sendJson(req, res, data) {
//     if (!data.statusCode && !data.headers) {
//         data = { data: data }
//     }

//     data.headers = data.headers || {}
//     data.data = JSON.stringify(data.data)
//     data.headers["content-type"] = "application/json"

//     send(req, res, data)
// }

// function sendHtml(req, res, data) {
//     if (typeof data !== "object") {
//         data = { data: data }
//     }

//     data.headers = data.headers || {}
//     data.headers["content-type"] = "text/html"

//     send(req, res, data)
// }

// function send(req, res, data) {
//     var statusCode
//         , headers = {}

//     if (typeof data === "object") {
//         statusCode = data.statusCode
//         headers = data.headers || {}
//         data = data.data
//     }

//     if (!Buffer.isBuffer(data)) {
//         data = new Buffer(data)
//     }

//     headers["content-length"] = data.length

//     res.statusCode = statusCode || res.statusCode || 200

//     forEach(headers, writeHeader, res)

//     res.end(data)
// }

// function writeHeader(value, headerName) {
//     this.setHeader(headerName, value)
// }
