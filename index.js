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
