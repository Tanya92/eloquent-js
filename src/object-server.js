/**
 * Created by dmitrii on 5.12.18.
 */
import Api from "./api.js";

import Notifications from "./notifications.js";

var saveFile = document.querySelector("#saveFile");
var fileName_Directory = document.querySelector("#fileName_Directory");
var fileContent = document.querySelector("#fileContent");

saveFile.addEventListener("click", function (event) {
    var fileName = "/" + fileName_Directory.value;
    event.preventDefault();
    if (!fileName_Directory.value) {
        return alert("Choose File Name");
    }
    (new Api(fileName)).asPut().send(fileContent.value)
        .then(() => (new Notifications(document.body).success("Successfully wrote to" + fileName_Directory.value)))
        .then(loadFileList)
        .then(() => {
            fileName_Directory.value = "";
            fileContent.value = "";
        })
        .catch(req => (new Notifications(document.body).error(req.responseText)));
});


var deleteFile = document.querySelector("#deleteFile");
deleteFile.addEventListener("click", function (event) {
    event.preventDefault();
    var fileName = "/" + fileName_Directory.value;
    (new Api(fileName)).asDelete().send(null)
        .then(() => (new Notifications(document.body).success("Successfully deleted " + fileName_Directory.value)))
        .then(loadFileList)
        .then(() => {
            fileName_Directory.value = "";
        })
        .catch(req => (new Notifications(document.body).error(req.responseText)));
});

var createDirectory = document.querySelector("#createDirectory");

createDirectory.addEventListener("click", function (event) {
    event.preventDefault();
    var pathDirectory = "/" + fileName_Directory.value;
    if (!fileName_Directory.value) {
        return alert("Enter Directory Name");
    }
    (new Api(pathDirectory)).asMKCOL().send(null)
        .then(() => (new Notifications(document.body).success("Successfully created " + fileName_Directory.value)))
        .then(loadFileList)
        .catch(req => (new Notifications(document.body).error(req.responseText)))
        .finally(() => {
            fileName_Directory.value = "";
        });

});
var fileList = document.querySelector("#fileList");


function loadFileList() {
    (new Api("/").asGet().send(null))
        .then(req => {
          var stringResult = req.responseText;
          var arrayResult = stringResult.split("\n");
          var fragment = document.createDocumentFragment();
          arrayResult.forEach(function (elem) {
              var path = "/" + elem;
              var div = document.createElement("div");
              div.id = "link_div";
              var link = document.createElement("a");
              var new_window = document.createElement("a");
              var external_link = document.createElement("i");
              new_window.appendChild(external_link);
              div.appendChild(link)
              div.appendChild(new_window);
              external_link.className = "fa fa-external-link";
              external_link.style.color = "black";
              new_window.setAttribute("href", path);
              new_window.setAttribute("target", "_blank");
              fragment.appendChild(div);

              link.setAttribute("href", path);
              link.innerText = elem;
              link.addEventListener("click", function (event) {
                  event.preventDefault();
                  loadFile(elem);
              });
          })
            fileList.innerHTML = "";
            fileList.appendChild(fragment);
        })
        .catch(req => (new Notifications(document.body).error(req.responseText)));
}

loadFileList();

function loadFile(path) {
    (new Api("/" + path).asGet().send(null))
        .then(req => {
            fileName_Directory.value = path;
            fileContent.value = req.responseText;
        });
}

var clear = document.querySelector("#clear");
clear.addEventListener("click", function (event) {
    event.preventDefault();
    fileName_Directory.value = "";
    fileContent.value = "";
})