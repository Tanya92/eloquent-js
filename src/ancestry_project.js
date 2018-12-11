const ANCESTRY_FILE = require("./ancestry.js");
var ancestry = JSON.parse(ANCESTRY_FILE);

function filter(array,test) {
    var passed = [];
    for (let i = 0;i < array.length;i++){
        if(test(array[i])){
            passed.push(array[i]);
        }
    }
    return passed;
}
function map(array, transform) {
    var mapped = [];
    for (let i = 0; i < array.length;i++){
        mapped.push(transform(array[i]));
    }
    return mapped;
}

/*let overNinety = ancestry.filter(person => person.died - person.born > 90);
 console.log(map(overNinety,person => person.name));
 */

function average(array) {
    function plus(a, b) { return a + b; }
    return array.reduce(plus) / array.length;
}

var byName = {};
ancestry.forEach(function(person) {
    byName[person.name] = person;
});

// Your code here.

let age_differences = ancestry.map(person => {
    let mother = byName[person.mother];
    if (mother) {
        return person.born - mother.born;
    }
    return undefined;
}).filter(Boolean);
//console.log(average(age_differences));
// → 31.2
function groupBy(arr,func) {
    let result = {};
    for (let i = 0; i < arr.length; i++){
        let key = func(arr[i]);
        if(result[key] == undefined){
            result[key] = [];
        }
        result[key].push(arr[i]);
    }
    return result;
}
let byCentury = groupBy(ancestry,person => Math.ceil(person.died/100));
function averageByCentury(byCentury){
    let result = {};
    for (let key in byCentury) {
        let people = byCentury[key];
        result[key] = average(
            people.map(person => person.died - person.born)
        );
    }
    return result;
}
function every(arr,func){
    for (let i = 0; i < arr.length; i++){
        if (!func(arr[i])){
            return false;
        }
    }
    return true;
}
function some(arr,func){
    for (let i = 0; i < arr.length; i++){
        if (func(arr[i])){
            return true;
        }
    }
    return false;
}
//console.log(every([NaN, NaN, NaN], isNaN));
// → true
//console.log(every([NaN, NaN, 4], isNaN));
// → false
//console.log(some([NaN, 3, 4], isNaN));
// → true
//console.log(some([2, 3, 4], isNaN));
// → false
//console.log(averageByCentury(byCentury));
/*console.log(filter(ancestry,function(person){
 return person.born > 1900 && person.born < 1925;
 }));*/
//console.log(ancestry.filter(person => person.father  == "Carel Haverbeke"));


