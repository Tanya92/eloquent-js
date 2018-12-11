/**
 * Created by dmitrii on 15.11.18.
 */
var req = new XMLHttpRequest();
req.open("GET", "data.txt", false);
req.send(null);
console.log(req.responseText);
console.log(req.status, req.statusText);
console.log(req.getResponseHeader("content-type"));

var reqTrue = new XMLHttpRequest();
reqTrue.open("GET", "data.txt", true);
reqTrue.addEventListener("load", function () {
    console.log("Done:", reqTrue.status);
});
reqTrue.send(null);

var reqXml = new XMLHttpRequest();
reqXml.open("GET", "fruits.xml", false);
req.setRequestHeader("Accept", );
reqXml.send(null);
console.log(reqXml.responseXML.querySelectorAll("fruit").length);

var reqJson = new XMLHttpRequest();
reqJson.open("GET", "fruits.json", false);
reqJson.send(null);
console.log(JSON.parse(reqJson.responseText));

function backgroundReadFile(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.addEventListener("load", function () {
        if (req.status < 400)
            callback(req.responseText);
    });
    req.send(null);
}
try {
    backgroundReadFile("data.txt", function (text) {
        if (text != "expected")
            throw new Error("That was unexpected");
    });
} catch (e){
    console.log("Hello from the catch block");
}
function getURL(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.addEventListener("load", function () {
        if (req.status < 400)
            callback(req.responseText);
        else
            callback(null, new Error("Request failed: " + req.statusText));
    });
    req.addEventListener("error", function () {
        callback(null, new Error("Network error"));
    });
    req.send(null);
}
getURL("nonsense.txt", function (content, error) {
    if (error != null)
        console.log("Failed to fetch nonsense.txt: " + error);
    else
        console.log("nonsense.txt: " + content);
});

function get(url) {
    return new Promise(function (succeed, fail) {
        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.addEventListener("load", function () {
            if (req.status < 400)
                succeed(req.responseText);
            else
                fail(new Error("Request failed: " + req.statusText));
        });
        req.addEventListener("error", function () {
            fail(new Error("Network error"));
        });
        req.send(null);
    });
}
get("data.txt").then(function (text) {
    console.log("data.txt: " + text);
}, function (error) {
    console.log("Failed to fetch data.txt: " + error);
});
function getJSON(url) {
    return get(url).then(JSON.parse);
}
