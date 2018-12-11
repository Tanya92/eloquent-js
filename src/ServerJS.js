/**
 * Created by dmitrii on 3.12.18.
 */
var http = require("http");
var server = http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    response.write("<h1>Привет!</h1><p>Вы запросили `" + request.url + "`</p>");
    response.end();
});
server.listen(8000);