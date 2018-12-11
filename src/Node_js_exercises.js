/**
 * Created by dmitrii on 7.12.18.
 */
function requestAuthor(acceptHeader) {
    var http = require("http");
    var request = http.request({
        hostname: "eloquentjavascript.net",
        path: "/author",
        method: "GET",
        headers: {Accept: acceptHeader}
    }, function (response) {
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
    });
    request.end();
}

requestAuthor("text/plain");
requestAuthor("text/html");
requestAuthor("application/json");