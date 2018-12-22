/**
 * Created by dmitrii on 13.12.18.
 */

var http = require("http");
var Router = require("./router");
var ecstatic = require("ecstatic");
var fs = require("fs");
var fileServer = ecstatic({root: "./public"});
var router = new Router();
var Handlebars = require("handlebars");
var qs = require("querystring");

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

http.createServer(function (request, response) {
    if (!router.resolve(request, response)) {
        fileServer(request, response);
    }
}).listen(8000);

function respond(response, status, data, type, headers) {
    if (headers) {
        headers["Content-Type"] = type || "text/plain";
    } else {
        headers = {
            "Content-Type": type || "text/plain"
        }
    }
    response.writeHead(status,headers);
    response.end(data);
}

function respondJSON(response, status, data) {
    respond(response, status, JSON.stringify(data),
        "application/json");
}

var talks = Object.create(null);
fs.stat("./talks.json", function (error) {
    if (error && error.code == "ENOENT") {
        fs.writeFile("./talks.json",JSON.stringify({}));
    } else if (!error) {
        readStreamAsJson(
            fs.createReadStream("./talks.json"),
            function (error, result) {
                if (!error) {
                    talks = result;
                }
            }
        )
    }

});
function writeChangesToFile(talks) {
    fs.writeFile("./talks.json", JSON.stringify(talks));
}
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
                        writeChangesToFile(talks);
                        registerChange(title);
                    }
                    respond(response, 204, null);
                });
router.add("GET",/^\/index\.html$/, function (request, response) {
    var client_template = `
        <div id="template" style="display: none">
            <div class="talk">
                <h2>{{title}}</h2>
                <div>by <span>{{presenter}}</span></div>
                <p>{{summary}}</p>
                <div class="comments">
                    <div template-repeat="comments">
                        <span template-if="author == 'Tanya'">
                            <i class="fa fa-star-o" aria-hidden="true"></i>
                        </span>
                        <span>{{author}}</span>: {{message}}
                        <button class="deleteComment">Delete Comment</button>
                    </div>
                </div>
                <form>
                    <input type="text" name="comment">
                    <button type="submit">Add comment</button>
                    <button type="button" class="del"> Delete talk</button>
                </form>
            </div>
        </div>
    `;
    fs.readFile("./public/index.html", "utf8", function (error, source) {
        if (error) {
            respond(response, 500, error.toString());
        } else {
            var talksArray = [];
            for (let title in talks) {
                var talk = talks[title];
                talk["title"] = title;
                talksArray.push(talk);
            }
            var context = {
                client_template: client_template,
                talks: talksArray
            };
            var template = Handlebars.compile(source);
            var html = template(context);
            respond(response, 200, html,"text/html");
        }
    });
});

router.add("POST", /^\/talks$/, function (request, response) {
    readStreamAsObject(request,function (error, talk) {
        if (error) {
            respond(response, 400, error.toString());
        } else {
            talks[talk.title] = {title: talk.title,
                            presenter: talk.presenter,
                            summary: talk.summary,
                            comments: []};
            writeChangesToFile(talks);
            respond(response, 303,null,null,{Location: "/index.html"});
        }
    })
});
router.add("POST",/^\/talks\/delete$/,function (request, response) {
    readStreamAsObject(request, function (error, talk) {
        if (error) {
            respond(response, 400, error.toString());
        } else {
            delete talks[talk.title];
            writeChangesToFile(talks);
            respond(response, 303, null, null, {Location:"/index.html"});
        }
    })
});
router.add("POST", /^\/talks\/comments$/, function (request, response) {
    readStreamAsObject(request, function (error, talk) {
        if (error) {
            respond(response, 400, error.toString());
        } else {
            if (!talks[talk.title]["comments"]) {
                talks[talk.title]["comments"] = [];
            }
            talks[talk.title]["comments"].push({
                author: talk.author,
                message: talk.comment
            });
            writeChangesToFile(talks);
            respond(response, 303, null, null, {Location:"/index.html"});
        }
    })
});
router.add("POST", /^\/talks\/deletecomments$/, function (request, response) {
    readStreamAsObject(request, function (error, talk) {
        if (error) {
            respond(response, 400, error.toString());
        } else {
            var position = talks[talk.title]["comments"].findIndex(function (elem) {
                if (elem.author == talk.author && elem.message == talk.comment) {
                    return true;
                }
                return false;
            });
            talks[talk.title]["comments"].splice(position,1);
            writeChangesToFile(talks);
            respond(response, 303, null, null, {Location:"/index.html"});
        }
    })
});
function readStreamAsObject(stream, callback) {
    var data = "";
    stream.on("data", function (chunk) {
        data += chunk;
    });
    stream.on("end", function () {
        var result = {}, error;
        try {
            result = qs.parse(data);
        } catch (e) {error = e;}
        callback(error, result);
    });
    stream.on("error", function (error) {
        callback(error);
    })
}
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
            writeChangesToFile(talks);
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
            writeChangesToFile(talks);
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
    if (query.changesSince == null) {
        var list = [];
        for (var title in talks)
            list.push(talks[title]);
        sendTalks(list, response);
    } else {
        var since = Number(query.changesSince);
        if (isNaN(since)) {
            respond(response, 400, "Invalid parameter");
        } else {
            var changed = getChangedTalks(since);
            if (changed.length > 0)
            {
                sendTalks(changed, response);
            }else {
                waitForChanges(since, response);
            }
        }
    }
});

var waiting = [];

function waitForChanges(since, response) {
    var waiter = {since: since, response: response};
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
