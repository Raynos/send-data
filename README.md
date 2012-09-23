# send-data [![build status][1]][2]

send data through response

## Example

```
var send = require("send-data")
    , sendJson = send.json
    , sendHtml = send.html
    , http = require("http")

http.createServer(function handleRequest(req, res) {
    if (req.url === "/send") {
        send(req, res, {
            data: "foo"
            , statusCode: 202
            , headers: {
                bar: "baz"
            }
        })
    } else if (req.url === "/optional") {
        send(req, res, "foo")
    } else if (req.url === "/json") {
        sendJson(req, res, {
            data: {
                foo: "bar"
            }
            , statusCode: 201
        })
    } else if (req.url === "/json/optional") {
        sendJson(req, res, {
            foo: "bar"
        })
    } else if (req.url === "/html") {
        sendHtml(req, res, {
            data: "<div>foo</div>"
            , statusCode: 200
            , headers: {}
        })
    } else if (req.url === "/html/optional") {
        sendHtml(req, res, "<div>foo</div>")
    }
}).listen(8080)
```

## Installation

`npm install send-data`

## Tests

`npm test`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://secure.travis-ci.org/Raynos/send-data.png
  [2]: http://travis-ci.org/Raynos/send-data