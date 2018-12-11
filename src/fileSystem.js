/**
 * Created by dmitrii on 3.12.18.
 */
var fs = require("fs");
fs.readFile("./file.txt", "utf8", function (error, text) {
    if (error)
        throw error;
    console.log("А в файле том было:", text);
});
fs.readFile("file.txt", function (error, buffer) {
    if (error)
        throw error;
    console.log("В файле было ", buffer.length, " байт.","Первый байт: ", buffer[0]);
});
fs.writeFile("graffiti.txt", "Здесь был Node ", function (err) {
    if (err)
        console.log("Ничего не вышло и вот почему: ", err);
    else
        console.log("Запись успешна. Все свободны.");
});