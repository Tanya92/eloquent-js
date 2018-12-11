/**
 * Created by dmitrii on 3.12.18.
 */
var http = require("http");
var request = http.request({
    hostname: "eloquentjavascript.net",
    path: "/20_node.html",
    method: "GET",
    headers: {Accept: "text/html"}
}, function (response) {
    console.log("Сервис ответил с кодом ", response.statusCode);
});
request.end();