var send = require("./index")

module.exports = sendHtml

function sendHtml(req, res, opts, callback) {
    if (typeof opts === "string") {
        opts = { body: opts }
    }

    opts.headers = opts.headers || {}
    opts.headers["Content-Type"] = "text/html"

    send(req, res, opts, callback)
}
