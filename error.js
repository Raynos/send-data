var sendJson = require("./json")
var isSendObject = require("./is-send-object.js")

module.exports = sendError

function sendError(req, res, opts, callback) {
    if (!isSendObject(opts)) {
        opts = { body: opts, statusCode: 500 }
    }

    var error = opts.body

    if (Array.isArray(error)) {
        opts.body = { errors: error }
    } else if (typeof error === "string") {
        opts.body = { errors: [{ message: error, attribute: "general" }] }
    } else if (error && typeof error.message === "string") {
        error.message = error.message
        Object.defineProperty(error, "type", {
            value: error.type,
            enumerable: true,
            writable: true,
            configurable: true
        })

        if (!error.attribute) {
            error.attribute = "general"
        }

        opts.body = { errors: [error] }
    }

    sendJson(req, res, opts, callback)
}
