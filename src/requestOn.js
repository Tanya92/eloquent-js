/**
 * Created by dmitrii on 4.12.18.
 */
var http = require("http");
const querystring = require('querystring');
http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    var path = request.url;
    var pos = path.indexOf("?");
    var queryParams = path.slice(pos + 1);
    if (pos != -1) {
        response.write(JSON.stringify(querystring.parse(queryParams)).toUpperCase());
    }
    request.on("data", function (chunk) {
        response.write(chunk.toString().toUpperCase());
        console.log(chunk.toString());
    });
    request.on("end", function () {
        response.end();
    });
}).listen(8000);