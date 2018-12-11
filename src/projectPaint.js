/**
 * Created by dmitrii on 21.11.18.
 */
function elt(name, attributes) {
    var node = document.createElement(name);
    if (attributes){
        for (var attr in attributes){
            if (attributes.hasOwnProperty(attr)){
                node.setAttribute(attr, attributes[attr]);
            }
        }
    }
    for (var i = 2; i < arguments.length; i++){
        var child = arguments[i];
        if (typeof child == "string") {
            child = document.createTextNode(child);
        }
        node.appendChild(child);
    }
    return node;
}
var controls = Object.create(null);

function createPaint(parent) {
    var canvas = elt("canvas", {width: 500, height: 300});
    canvas.style.borderWidth = 2 + "px";
    canvas.style.borderColor = "black";
    canvas.style.borderStyle = "solid";
    canvas.style.boxSizing = "border-box";
    var cx = canvas.getContext("2d");
    var toolbar = elt("div", {class: "toolbar"});
    for (var name in controls){
        toolbar.appendChild(controls[name](cx));
    }
    var panel = elt("div", {class: "picturepanel"}, canvas);
    parent.appendChild(elt("div", null, panel, toolbar));
}

var tools = Object.create(null);

controls.tool = function (cx) {
    var select = elt("select");
    for (var name in tools) {
        select.appendChild(elt("option", null, name));
    }

    cx.canvas.addEventListener("mousedown", function (event) {
        if (event.which == 1) {
            tools[select.value](event, cx);
            event.preventDefault();
        }
    });

    return elt("span", null, "Tool: ", select);
};
function relativePos(event, element) {
    var rect = element.getBoundingClientRect();
    return {x: Math.floor(event.clientX - rect.left),
    y: Math.floor(event.clientY - rect.top)};
}
function trackDrag(onMove, onEnd) {
    function end(event) {
        removeEventListener("mousemove", onMove);
        removeEventListener("mouseup", end);
        if (onEnd) {
            onEnd(event);
        }
    }
    addEventListener("mousemove", onMove);
    addEventListener("mouseup", end);
}

tools.Line = function (event, cx, onEnd) {
    cx.lineCap = "round";

    var pos = relativePos(event, cx.canvas);
    trackDrag(function (event) {
        cx.beginPath();
        cx.moveTo(pos.x, pos.y);
        pos = relativePos(event, cx.canvas);
        cx.lineTo(pos.x, pos.y);
        cx.stroke();
    }, onEnd);
};

tools.Erase = function (event, cx) {
    cx.globalCompositeOperation = "destination-out";
    tools.Line(event, cx, function () {
        cx.globalCompositeOperation = "source-over";
    });
};

controls.color = function (cx) {
    var input = elt("input", {type: "color"});
    input.addEventListener("change", function () {
        cx.fillStyle = input.value;
        cx.strokeStyle = input.value;
    });
    function componentToHex(num) {
        var data = Number(num).toString(16);
        return data.length == 1 ? "0" + data : data;
    }

    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    cx.canvas.addEventListener("pickColor", function (event) {

        var colors = event.detail.colors;
        input.value = rgbToHex(colors[0],colors[1], colors[2]);
        cx.fillStyle = input.value;
        cx.strokeStyle = input.value;
        console.log(colors, rgbToHex(colors[0],colors[1], colors[2]));
    });

    console.log(input.value, cx.strokeStyle, cx.fillStyle);
    return elt("span", null, "Color: ", input);
};
controls.brushSize = function (cx) {
    var select = elt("select");
    var sizes = [1, 2, 3, 5, 8, 12, 25, 35, 50, 75, 100];
    sizes.forEach(function (size) {
        select.appendChild(elt("option", {value: size}, size + " pixels"));
    });
    select.addEventListener("change", function () {
        cx.lineWidth = select.value;
    });
    return elt("span", null, "Brush size: ", select);
};
controls.save = function (cx) {
    var link = elt("a", {href: "/"}, "Save");
    function update() {
        try {
            link.href = cx.canvas.toDataURL();
        } catch (e) {
            link.href = "javascript:alert(" +
                        JSON.stringify("Can't save: " + e.toString()) + ")";
        }
    }
    link.addEventListener("mouseover", update);
    link.addEventListener("focus", update);
    return link;
};
function loadImageURL(cx, url) {
    var image = document.createElement("img");
    image.addEventListener("load", function () {
        var color = cx.fillStyle, size = cx.lineWidth;
        cx.canvas.width = image.width;
        cx.canvas.height = image.height;
        cx.drawImage(image, 0, 0);
        cx.fillStyle = color;
        cx.strokeStyle = color;
        cx.lineWidth = size;
    });
    image.src =  url;
}

controls.openFile = function (cx) {
    var input = elt("input", {type: "file"});
    input.addEventListener("change", function () {
        if (input.files.length == 0) return;
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            loadImageURL(cx, reader.result);
        });
        reader.readAsDataURL(input.files[0]);
    });
    return elt("div", null, "Open file: ", input);
};

controls.openURL = function (cx) {
    var input = elt("input", {type: "text"});
    var form = elt("form", null, "Open URL: ", input, elt("button", {type: "submit"}, "load"));
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        loadImageURL(cx, form.querySelector("input").value);
    });
    return form;
};
controls.clear = function (cx) {
    var button = elt("button", {type: "button"}, "clear");
    button.addEventListener("click", function () {
        cx.clearRect(0, 0, cx.canvas.width, cx.canvas.height);
    });
    return button;
}
tools.Text = function (event, cx) {
    var text = prompt("Text:", "");
    if (text) {
        var pos = relativePos(event, cx.canvas);
        cx.font = Math.max(7, cx.lineWidth) + "px sans-serif";
        cx.fillText(text, pos.x, pos.y);
    }
};

tools.Spray = function (event, cx) {
    var radius = cx.lineWidth / 2;
    var area = radius * radius * Math.PI;
    var dotsPerTick = Math.ceil(area / 30);

    var currentPos = relativePos(event, cx.canvas);
    var spray = setInterval(function () {
        for (var i = 0; i < dotsPerTick; i++){
            var offset = randomPointRadius(radius);
            cx.fillRect(currentPos.x + offset.x,
                currentPos.y + offset.y, 1, 1);
        }
    }, 25);
    trackDrag(function (event) {
        currentPos = relativePos(event, cx.canvas);
    }, function () {
        clearInterval(spray);
    });
};

function randomPointRadius(radius) {
    for (;;) {
        var x = Math.random() * 2 - 1;
        var y = Math.random() * 2 - 1;
        if (x * x + y * y  <= 1) {
            return {x: x * radius, y: y* radius};
        }
    }
}
tools.Rectangle = function (event, cx) {
    var start = relativePos(event, cx.canvas);
    var pos = start;
    var div = document.createElement("div");
    document.body.appendChild(div);
    div.style.position = "absolute";
    var rect = cx.canvas.getBoundingClientRect();
    var borderWidth = parseInt(getComputedStyle(cx.canvas, null).getPropertyValue("border-top-width"));
    var posX = pos.x, posY = pos.y;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var startY = start.y + scrollTop;
    trackDrag(function (event) {
        pos = relativePos(event, cx.canvas);
        posX = pos.x, posY = pos.y + scrollTop;
        if (posX < 0)
            posX = 0;
        if (posX > cx.canvas.width)
            posX = cx.canvas.width;
        if (pos.y < 0)
            pos.y = 0;
        if (pos.y > cx.canvas.height)
            pos.y = cx.canvas.height;
        if (posY > cx.canvas.height + scrollTop)
            posY = cx.canvas.height + scrollTop;
        if (posY < scrollTop)
            posY = scrollTop;
        div.style.borderColor = cx.strokeStyle;
        div.style.borderWidth = cx.lineWidth + "px";
        div.style.borderStyle = "solid";
        div.style.boxSizing = "border-box";
        div.style.left = Math.round(Math.min(start.x, posX) + rect.left + borderWidth) + "px";
        div.style.top = Math.round(Math.min(startY, posY) + rect.top + borderWidth) + "px";
        div.style.width = Math.round((Math.abs(posX - start.x))) + "px";
        div.style.height = Math.round((Math.abs(posY - startY))) + "px";

    }, function () {
        document.body.removeChild(div);
        var left = Math.round(Math.min(start.x, posX));
        var top = Math.round(Math.min(start.y, pos.y));
        cx.beginPath();
        cx.strokeRect(
            left + (cx.lineWidth % 2 == 0 ? 0 : 0.5) + Math.floor(cx.lineWidth / 2),
            top + (cx.lineWidth % 2 == 0 ? 0 : 0.5) + Math.floor(cx.lineWidth / 2),
            Math.round(Math.abs(posX - start.x)) - cx.lineWidth,
            Math.round(Math.abs(pos.y - start.y)) - cx.lineWidth
        );
        cx.stroke();
    });
};

function pixelAt(cx, x, y) {
    var data = cx.getImageData(x, y, 1, 1);
    return data.data;
}

tools["Pick color"] = function (event, cx) {
    try {
        var pos = relativePos(event, cx.canvas);
        var colors = pixelAt(cx, pos.x, pos.y);

        cx.canvas.dispatchEvent(new CustomEvent("pickColor", {
                detail: {
                    colors
                }
            }
        ));
    } catch (e) {
        alert("Can't pick color: " + e.toString());
    }
};



tools["Flood fill"] = function (event, cx) {
  var pos = relativePos(event, cx.canvas);
  var data = cx.getImageData(0, 0, cx.canvas.width, cx.canvas.height);
    function isSameColor(x1, y1, x2, y2) {
        var pixelPos1 = (x1 + data.width * y1) * 4;
        var pixelPos2 = (x2 + data.width * y2) * 4;
        for (let i = 0; i < 4; i++ ){
            if (data.data[pixelPos1 + i] != data.data[pixelPos2 + i])
                return false;
        }
        return true;
    }
    function allNeighbors(x,y, fn){
        fn({x: x, y: y + 1});
        fn({x: x, y: y - 1});
        fn({x: x - 1, y: y});
        fn({x: x + 1, y: y});
    }
  var pointsToVisit = [pos];
  var visitedPoints = {};
  function floodFill() {
      while (pointsToVisit.length)  {
          var {x,y} = pointsToVisit.shift();
          var key = x + " " + y;
          if (visitedPoints[key]) {
              continue;
          }
          visitedPoints[key] = true;
          cx.fillRect(x, y, 1,1);
         allNeighbors(x, y, function (res) {
             if (res.x >= 0 && res.x < data.width && res.y >= 0 && res.y < data.height
                 && isSameColor(pos.x, pos.y, res.x, res.y)) {
                 pointsToVisit.push({x: res.x, y: res.y});
             }
         });
          }
      }
  floodFill();
};
