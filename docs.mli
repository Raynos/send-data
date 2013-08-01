type ErrorObject := { attribute: String, message: String }
type MaybeErrorObject := Array<ErrorObject> | String | Error
type SendObject<T> := {
    headers?: Object<String, String>,
    body?: T,
    statusCode?: Number
}

send-data := (HttpRequest, HttpResponse,
    Buffer | String | SendObject<Buffer | String>)

send-data/json := (HttpRequest, HttpResponse, Any | SendObject<Any>, options?: {
    pretty?: Boolean,
    space?: String,
    replace?: Function
})

send-data/html := (HttpRequest, HttpResponse, String | SendObject<String>)

send-data/error := (HttpRequest, HttpResponse,
    MaybeErrorObject | SendObject<MaybeErrorObject>)
