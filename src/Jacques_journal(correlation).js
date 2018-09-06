const JOURNAL = require("./jacques_journal");
var journal = [];

function addEntry(events, didITurnIntoASquirrel) {
    journal.push({
        events: events,
        squirrel: didITurnIntoASquirrel
    });
}
function phi(table) {
    return (table[3] * table[0]-table[2] * table[1])/
        Math.sqrt((table[2] + table[3]) *
            (table[0] + table[1]) *
            (table[1] + table[3]) *
            (table[0] + table[2]));

}

//console.log(phi([76, 9, 4, 1]));

function hasEvent(event, entry) {
    return entry.events.indexOf(event) != -1;
}

function tableFor(event, journal) {
    var table = [0, 0,  0, 0];
    for (let i = 0; i < journal.length; i++){
        var entry = journal[i], index = 0;
        if (hasEvent(event,entry)) index += 1;
        if (entry.squirrel) index += 2;
        table[index] += 1;
    }
    return table;
}

console.log(tableFor("pizza",JOURNAL));
var map = {};
function storePhi(event, phi) {
    map[event] = phi;
}
storePhi("пицца", 0.069);
storePhi("тронул дерево", -0.081);
console.log("пицца" in map);
console.log(map["тронул дерево"]);