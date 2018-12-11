/**
 * Created by dmitrii on 25.9.18.
 */
/*
verify (/ca[rt]/,
        ["my car", "bad cats"],
        ["camper", "high art"]);
verify (/pr?op/,
    ["pop culture", "mad props"],
    ["plop"]);
verify (/ferr(et|y|ari)/,
    ["ferret", "ferry", "ferrari"],
    ["ferrum", "transfer A"]);
verify (/ious\b/,
    ["how delicious", "spacious room"],
    ["ruinous", "consciousness"]);
verify (/\s[.,:;]/,
    ["bad punctuation ."],
    ["escape the dot"]);
verify (/\w{7,}/,
    ["hottentottentententen"],
    ["no", "hotten totten tenten"]);
verify (/\b[^\We]+\b/i,
    ["red platypus", "wobbling nest"],
    ["earth bed", "learning ape"]);

function verify(regexp, yes, no) {
    if (regexp.source == "...") return;
    yes.forEach(function (s) {
        if (!regexp.test(s))
            console.log("Не нашлось '" + s + "'");
    });
    no.forEach(function (s) {
        if (regexp.test(s))
            console.log("Неожиданное вхождение '" + s + "'");
    });
}
*/

var text = "'I'm the cook,' he said, 'it's my job.'";
// Change this call.
//console.log(text.replace(/^'|'$|\s'|,'/g, '"'));
// → "I'm the cook," he said, "it's my job."
var month = function() {
    var months = ["January", "February", "March", "April",
        "May", "June", "July", "August", "September", "October", "November", "December"];
    return {
        name: function(number) {return months[number];},
        number: function(name) {return months.indexOf(name);}
    }
}();
console.log(month.name(2));
console.log(month.number("November"));