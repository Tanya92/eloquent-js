/**
 * Created by dmitrii on 17.11.18.
 */
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

function all(promises) {
    return new Promise(function (success, fail) {
        var arr = [];
        promises.forEach(function (promise) {
            promise.then(function (value) {
                arr.push(value);
                if (arr.length == promises.length)
                    success(arr);
            }).catch(function (error) {
                fail(error);
            })
        })
        if (arr.length == 0)
            success(arr);
    });
}

// run code

all([]).then(
    function (array) {
        console.log("Это должен быть []:", array);
    });

function soon(val) {
    return new Promise(function (success) {
        setTimeout(function () { success(val); },
            Math.random() * 500);
    });
}

all([soon(1), soon(2), soon(3)]).then(
    function (array) {
        console.log("Это должен быть [1, 2, 3]: ", array);
    });

function fail() {
    return new Promise(
        function (success, fail) {
            fail( new Error("бабах"));
        });
}
all([soon(1), fail(), soon(3)]).then(
    function (array) {
        console.log("Сюда мы попасть не должны ");
    },
    function (error) {
        if (error.message != "бабах")
            console.log("Неожиданный облом:", error);
    });