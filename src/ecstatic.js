/**
 * Created by dmitrii on 13.12.18.
 */

var http = require("http");
var Router = require("./router");
var ecstatic = require("ecstatic");

var fileServer = ecstatic({root: "./public"});
var router = new Router();

http.createServer(function (request, response) {
    if (!router.resolve(request, response)) {
        fileServer(request, response);
    }
}).listen(8000);

function respond(response, status, data, type) {
    response.writeHead(status, {
        "Content-Type": type || "text/plain"
    });
    response.end(data);
}

function respondJSON(response, status, data) {
    respond(response, status. JSON.stringify(data),
        "application/json");
}

var talks = Object.create(null);

router.add("GET", /^\/talks\/([^\/]+)$/,
                function (request, response, title) {
                    if (title in talks) {
                        respondJSON(response, 200, talks[title]);
                    } else {
                        respond(response, 404, "No talk '" + title + "' found");
                    }
                });

router.add("DELETE", /^\/talks\/([^\/]+)$/,
                function (request, response, title) {
                    if (title in talks) {
                        delete talks[title];
                        registerChange(title);
                    }
                    respond(response, 204, null);
                });

function readStreamAsJson(stream, callback) {
    var data = "";
    stream.on("data", function (chunk) {
        data += chunk;
    });
    stream.on("end", function () {
        var result, error;
        try { result = JSON.parse(data);}
        catch (e) {error = e;}
        callback(error, result);
    });
    stream.on("error", function (error) {
        callback(error);
    });
}
router.add("PUT", /^\/talks\/([^\/]+)$/,
    function (request, response, title) {
    readStreamAsJson(request, function (error, talk) {
        if (error) {
            respond(response, 400, error.toString());
        } else if (!talk || typeof talk.presenter != "string"
        || typeof talk.summary != "string") {
            respond(response, 400, "Bad talk data");
        } else {
            talks[title] = {title: title,
                            presenter: talk.presenter,
                            summary: talk.summary,
                            comments: []};
            registerChange(title);
            respond(response, 204, null);
        }
    });
});

router.add("POST", /^\/talks\/([^\/]+)\/comments$/,
            function (request, response, title) {
    readStreamAsJson(request, function (error, comment) {
        if (error) {
            respond(response, 400, error.toString());
        } else if (!comment || typeof comment.author != "string" || typeof comment.message != "string") {
            respond(response, 400, "Bad comment data");
        } else if (title in talks) {
            talks[title].comments.push(comment);
            registerChange(title);
            respond(response, 204, null);
        } else {
            respond(response, 404, "No talk '" + title + "' found");
        }
    });
});

function sendTalks(talks, response) {
    respondJSON(response, 200, {
        serverTime: Date.now(),
        talks: talks
    });
}

router.add("GET", /^\/talks$/, function (request, response) {
    var query = require("url").parse(request.url, true).query;
    if (query.changeSince == null) {
        var list = [];
        for (var title in talks)
            list.push(talks[title]);
        sendTalks(list, response);
    } else {
        var since = Number(query.changeSince);
        if (isNaN(since)) {
            respond(response, 400, "Invalid parameter");
        } else {
            var changed = getChangedTalks(since);
            if (changed.length > 0)
            {
                sendTalks(changed, response);
            }else {
                waitForChanges(since, responce);
            }
        }
    }
});

var waiting = [];

function waitForChanges(since, response) {
    var waiter = {since: since, responce: responce};
    waiting.push(waiter);
     setTimeout(function () {
         var found = waiting.indexOf(waiter);
         if (found > -1) {
             waiting.splice(found, 1);
             sendTalks([], response);
         }
     }, 90 * 1000);
}

var changes = [];

function registerChange(title) {
    changes.push({title: title, time: Date.now()});
    waiting.forEach(function (waiter) {
        sendTalks(getChangedTalks(waiter.since), waiter.response);
    });
    waiting = [];
}

function getChangedTalks(since) {
    var found = [];
    function alreadySeen(title) {
        return found.some(function (f) {
            return f.title == title;});
    }
    for (var i = changes.length - 1; i >= 0; i--) {
        var change = changes[i];
        if (change.time <= since) {
            break;
        } else if (alreadySeen(change.title)) {
            continue;
        } else if (change.title in talks) {
            found.push(talks[change.title]);
        } else {
            found.push({title: change.title, deleted: true});
        }
    }
    return found;
}

function request(options, callback) {
    var req = new XMLHttpRequest();
    req.open(options.method || "GET", options.pathname, true);
    req.addEventListener("load", function () {
        if (req.status < 400) {
            callback(null, req.responseText);
        } else {
            callback(new Error("Request failed: " + req.statusText));
        }
    });
    req.addEventListener("error", function () {
        callback(new Error("NetWork error"));
    });
    req.send(options.body || null);
}

var lastServerTime = 0;

request({pathname: "talks"}, function (error, response) {
    if (error) {
        reportError(error);
    } else {
        response = JSON.parse(response);
        displayTalks(response.talks);
        lasrServerTime = response.serverTime;
        waitForChanges();
    }
});

function reportError(error) {
    if (error)
        alert(error.toString());
}

var talkDiv = document.querySelector("#talks");
var shownTalks = Object.create(null);

function displayTalks(talks) {
    talks.forEach(function (talk) {
        var shown = shownTalks[talk.title];
        if (talk.deleted) {
            if (shown) {
                talkDiv.removeChild(shown);
                delete shownTalks[talk.title];
            }
        } else {
            var node = drawTalk(talk);
            if (shown){
                talkDiv.replaceChild(node, shown);
            } else {
                talkDiv.appendChild(node);
            }
            shownTalks[talk.title] = node;
        }
    });
}

function  instantiateTemplate(name, values) {
    function instantiateText(text) {
        return text.replace(/\{\{(\w+)\}\}/g, function (_, name) {
            return values[name];
        });
    }
    function instantiate(node) {
        if (node.nodeType == document.ELEMENT_NODE) {
            var copy = node.cloneNode();
            for (var i = 0; i < node.childNodes.length; i++) {
                copy.appendChild(instantiate(node.childNodes[i]));
            }
            return copy;
        } else if (node.nodeType == document.TEXT_NODE) {
            return document.createTextNode(instantiateText(node.nodeValue));
        }
    }

    var template = document.querySelector("#template ." + name);
    return instantiate(template);
}

function drawTalk(talk) {
    var node = instantiateTemplate("talk", talk);
    var comments = node.querySelector(".comments");
    talk.comments.forEach(function (comment) {
        comments.appendChild(instantiateTemplate("comment", comment));
    });

    node.querySelector("button.del").addEventListener("click", deleteTalk.bind(null, talk.title));
    var form = node.querySelector("form");
    form.addEventListener("submit",  function (event) {
        event.preventDefault();
        addComment(talk.title, form.elements.comment.value);
        form.reset();
    });
    return node;
}

function talkURL(title) {
    return "talks/" + encodeURIComponent(title);
}

function deleteTalk(title) {
    request({pathname: talkURL(title), method: "DELETE"}, reportError);
}

function addComment(title, comment) {
    var comment = {author: nameField.value, message: comment};
    request({pathname: talkURL(title) + "/comments", body: JSON.stringify(comment), method: "POST"}, reportError);
}

var nameField = document.querySelector("#name");

nameField.value = localStorage.getItem("name") || "";

nameField.addEventListener("change", function () {
    localStorage.setItem("name", nameField.value);
});

var talkForm = document.querySelector("#newtalk");
talkForm.addEventListener("submit", function (event) {
    event.preventDefault();
    request({pathname: talkURL(talkForm.elements.title.value), method: "PUT", body: JSON.stringify({presenter: nameField.value, summary: talkForm.elements.summary.value})}, reportError);
    talkForm.reset();
});

function waitForChanges() {
    request({pathname: "talks?changesSince=" + lastServerTime}, function (error, response) {
        if (error) {
            setTimeout(waitForChanges, 2500);
            console.error(error.stack);
        } else {
            response = JSON.parse(response);
            displayTalks(response.talks);
            lastServerTime = response.serverTime;
            waitForChanges();
        }
    });
}

