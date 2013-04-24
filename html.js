var send = require("./index")

module.exports = sendHtml

/*  sendHtml := (HttpRequest, HttpResponse, String | {
        body: String,
        headers?: Object<String, String>,
        statusCode?: Number
    })
*/
function sendHtml(req, res, html) {
    if (typeof html !== "object") {
        html = { body: html }
    }

    html.headers = html.headers || {}
    html.headers["Content-Type"] = "text/html"

    send(req, res, html)
}
