/**
 * Created by dmitrii on 15.11.18.
 */
function backgroundReadFile(url, callback,headers) {
     var req = new XMLHttpRequest();
     req.open("GET", url, true);
     req.addEventListener("load", function () {
     if (req.status < 400)
        callback(req.responseText);
     });
     if (headers) {
         for (let key in headers ){
             req.setRequestHeader(key, headers[key]);
         }
     }
     req.send(null);
 }
 /*
backgroundReadFile("http://eloquentjavascript.net/author", function (text) {
    backgroundReadFile("http://eloquentjavascript.net/author", function (xml) {
        backgroundReadFile("http://eloquentjavascript.net/author", function (json) {
            console.log(text);
            console.log(xml);
            console.log(json);
        }, {"Accept": "application/json"});
    }, {"Accept": "text/html"});
}, {"Accept": "text/plain"});
*/
function get(url, headers) {
    return new Promise(function (succeed, fail) {
        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.addEventListener("load", function () {
            if (req.status < 400)
                succeed(req.responseText);
            else
                fail(new Error("Request failed: " + req.statusText));
        });
        if (headers) {
            for (let key in headers) {
                req.setRequestHeader(key, headers[key]);
            }
        }
        req.addEventListener("error", function () {
            fail(new Error("Network error"));
        });
        req.send(null);
    });
}

get("http://eloquentjavascript.net/author",{"Accept": "text/plain"})
    .then(function (text) {
        var arr = [text];
        return get("http://eloquentjavascript.net/author", {"Accept": "text/html"}).then(function (xml) {
            arr.push(xml);
            return arr;
        })
    }).then(function (arr) {
                return get("http://eloquentjavascript.net/author", {"Accept": "application/json"}).then(function (json) {
                    arr.push(json);
                    return arr;
                })
    }).then(function (arr) {
        for (let i = 0; i < arr.length; i++){
            console.log(arr[i]);
        }
})