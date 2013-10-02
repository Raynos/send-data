var send = require("./index")

module.exports = sendJs

function sendJs(req, res, opts, callback) {
    if (typeof opts === "string") {
        opts = { body: opts }
    }

    opts.headers = opts.headers || {}
    opts.headers["Content-Type"] = "text/javascript"

    send(req, res, opts, callback)
}
