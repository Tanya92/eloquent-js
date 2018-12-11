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
        .then(() => (new Notifications(document.body).success("Successfully deleted " + deleteFile.value)))
        .then(loadFileList)
        .then(() => {
            deleteFile.value = "";
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
              var link = document.createElement("a");
              fragment.appendChild(link);
              link.setAttribute("href", "/" + elem);
              link.setAttribute("target", "_blank");
              link.innerText = elem;
          })
            fileList.innerHTML = "";
            fileList.appendChild(fragment);
        })
        .catch(req => (new Notifications(document.body).error(req.responseText)));
}

loadFileList();