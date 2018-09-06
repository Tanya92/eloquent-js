/*function min(a,b) {
    if (a < b) {
        return a;
    }
    return b;
}
console.log(min(0,-10));
*/

function isEven(num) {
    if (num == 0) {
        return true;
    }
    if (num == 1) {
        return false;
    }
    if (num < 0) {
        return isEven(-num);
    }
    return isEven(num - 2);
}
console.log(isEven(-10));


/*function countBs(str){
    let count = 0;
    for (let i = 0; i < str.length; i++){
        if (str[i] == "B"){
            count++;
        }
    }
    return count;
}
*/

/*
function countChar(str,char){
    let count = 0;
    for (let i = 0; i < str.length; i++){
        if (str[i] == char){
            count++;
        }
    }
    return count;
}
console.log(countChar("djgfdaaaaajgNsfshjfh","a"));
*/