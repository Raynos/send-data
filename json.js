var send = require("./index")

module.exports = sendJson

function sendJson(req, res, value, opts) {
    if (!value || (!value.statusCode && !value.headers)) {
        value = { body: value }
    }

    opts = opts || {}
    if (opts.pretty) {
        opts.space = "    "
    }

    value.headers = value.headers || {}
    value.body = JSON.stringify(value.body,
        opts.replacer || null, opts.space || "")
    value.headers["Content-Type"] = "application/json"

    send(req, res, value)
}
