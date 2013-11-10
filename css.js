var send = require("./index")

module.exports = sendCss

function sendCss(req, res, opts, callback) {
    if (typeof opts === "string") {
        opts = { body: opts }
    }

    opts.headers = opts.headers || {}
    opts.headers["Content-Type"] = "text/css"

    send(req, res, opts, callback)
}