/**
 * Created by dmitrii on 7.9.18.
 */
const file_ancestry = require("./ancestry.js");
function filter(array,test) {
    var passed = [];
    for (let i = 0;i < array.length;i++){
        if(test(array[i])){
            passed.push(array[i]);
        }
    }
    return passed;
}
console.log(filter(file_ancestry,function(person){
    return person.born > 1900 && person.born < 1925;
}));