
function arrayToList(array) {
    let list = null;
    for (let i = array.length - 1; i >= 0; i--) {
        list = {value: array[i], rest: list};
    }
    return list;
}
function arrayToList2(arr){

    let list= {
        value: arr[0],
        rest: null
    };
    let lastEl = list;
    for (let i = 1; i < arr.length; i++){
        let newEl = {
            value: arr[i],
            rest:null
        };
        lastEl.rest = newEl;
        lastEl = newEl;
    };
    return list;
}

function prepend(elem,list){
    list = {value: elem, rest: list};
}
function nth(list,num){
    let curEl = list;
   for (let i = 1; i < num; i++) {
       curEl = curEl.rest;
       if (curEl == null){
           return undefined;
       }
   }

   return curEl.value;


}
function deepEqual(obj1,obj2){
    if (obj1 instanceof Object && obj2 instanceof Object){
        let keys1 = Object.keys(obj1);
        let keys2 = Object.keys(obj2);
        if (keys1.length != keys2.length){
            return false;
        }
       for (let prop in obj1){
           if (deepEqual(obj1[prop],obj2[prop]) == false) {
               return false;
           }
       }
       return true;
    }
    return obj1 == obj2;
}
 let list = arrayToList([4,6,8,91,34,5,0,-34,-7,1]);
console.log(nth(list,3));

var obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, {here: 1, object: 2}));
// → false
console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
// → true”