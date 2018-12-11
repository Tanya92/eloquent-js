/**
 * Created by dmitrii on 3.12.18.
 */
module.exports = function (string) {
    return string.split("").map(function (ch) {
        return String.fromCharCode(ch.charCodeAt(0) + 5);
    }).join("");
};