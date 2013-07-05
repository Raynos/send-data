var sendJson = require("./json")

module.exports = sendError

function sendError(req, res, opts) {
    if (!opts.statusCode || !opts.error) {
        opts = { error: opts, statusCode: 500 }
    }

    var error = opts.error
    var statusCode = opts.statusCode
    var headers = opts.headers
    var body
    if (Array.isArray(error)) {
        body = { errors: error }
    } else if (typeof error === "string") {
        body = { errors: [{ message: error, attribute: "general" }] }
    } else if (error && typeof error.message === "string") {
        body = { errors: [
            { message: error.message, attribute: "general" }
        ] }
    }

    sendJson(req, res, {
        statusCode: statusCode,
        body: body,
        headers: headers
    })
}
