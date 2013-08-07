var send = require("./index")
var isSendObject = require("./is-send-object")

module.exports = sendJson

function sendJson(req, res, opts, callback) {
    if (!isSendObject(opts)) {
        opts = { body: opts }
    }

    opts = opts || {}
    if (opts.pretty) {
        opts.space = "    "
    }

    opts.headers = opts.headers || {}
    opts.body = JSON.stringify(opts.body,
        opts.replacer || null, opts.space || "")
    opts.headers["Content-Type"] = "application/json"

    send(req, res, opts, callback)
}
