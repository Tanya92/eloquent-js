/**
 * Created by dmitrii on 14.12.18.
 */

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
        talkDiv.innerHTML = "";
        displayTalks(response.talks);
        lastServerTime = response.serverTime;
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
                var comments = node.querySelector(".comments");
                var shownComments = shown.querySelector(".comments");
                shown.replaceChild(comments, shownComments);
            } else {
                talkDiv.appendChild(node);
                shownTalks[talk.title] = node;
            }

        }
    });
}

function  instantiateTemplate(name, values) {
    function instantiateText(text, values) {
        return text.replace(/\{\{(\w+)\}\}/g, function (_, name) {
            return values[name];
        });
    }
    function instantiate(node,values) {
        if (node.nodeType == document.ELEMENT_NODE && node.hasAttribute("template-if")) {
            var conditionBody = "return " + node.getAttribute("template-if") + ";";
            var bindArguments = [Function].concat(Object.keys(values)).concat(conditionBody);
            var boundedFunc = (Function.prototype.bind.apply(Function, bindArguments));
            var functionCondition = new boundedFunc;
            if (functionCondition.apply(null, Object.values(values))) {
                var copy = node.cloneNode(true);
                copy.removeAttribute("template-if");
                return instantiate(copy, values);
            } else {
                return document.createComment("");
            }
        }
        if (node.nodeType == document.ELEMENT_NODE && node.hasAttribute("template-repeat")) {
            var array = node.getAttribute("template-repeat");
            var fragment = document.createDocumentFragment();
            for (var i = 0; i < values[array].length; i++) {
               var copy = node.cloneNode(true);
               copy.removeAttribute("template-repeat");
               fragment.appendChild(instantiate(copy,values[array][i]));
            }
            return fragment;
        }
        if (node.nodeType == document.ELEMENT_NODE) {
            var copy = node.cloneNode();
            if (copy.hasAttributes()){
                var attrs = copy.attributes;
                for(var i = attrs.length - 1; i >= 0; i--) {
                   attrs[i].value = instantiateText(attrs[i].value, values);
                }
            }
            for (var i = 0; i < node.childNodes.length; i++) {
                copy.appendChild(instantiate(node.childNodes[i],values));
            }
            return copy;
        } else if (node.nodeType == document.TEXT_NODE) {
            return document.createTextNode(instantiateText(node.nodeValue, values));
        }

    }

    var template = document.querySelector("#template ." + name);
    return instantiate(template, values);
}

function drawTalk(talk) {
    var node = instantiateTemplate("talk", talk);
    node.querySelector("button.del").addEventListener("click", deleteTalk.bind(null, talk.title));
    var arrayButtons = node.querySelectorAll("button.deleteComment")
        for (let i = 0; i < arrayButtons.length; i++) {
            arrayButtons[i].addEventListener("click", function (event) {
                deleteComment(talk.title, event.target.getAttribute("data-author"), event.target.getAttribute("data-message"));
            });
        }
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
function deleteComment(title,author,comment) {
    var comment = {author: author, message: comment};
    request({pathname:talkURL(title) + "/comments", body: JSON.stringify(comment), method: "DELETE"}, reportError);
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
    talkForm.elements.title.value = "";
    talkForm.elements.summary.value = "";
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

