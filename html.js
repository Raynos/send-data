var send = require("./index")

module.exports = sendHtml

function sendHtml(req, res, html) {
    if (typeof html !== "object") {
        html = { body: html }
    }

    html.headers = html.headers || {}
    html.headers["Content-Type"] = "text/html"

    send(req, res, html)
}
