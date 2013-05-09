var sendJson = require("./json")

module.exports = sendError

function sendError(req, res, error, statusCode) {
    var message = typeof error === "string" ? error : error.message

    sendJson(req, res, {
        statusCode: statusCode || 500,
        body: { message: message }
    })
}
