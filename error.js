var sendJson = require("./json")

module.exports = sendError

function sendError(req, res, error) {
    var message = typeof error === "string" ? error : error.message

    sendJson(req, res, {
        statusCode: 500,
        body: { message: message }
    })
}
