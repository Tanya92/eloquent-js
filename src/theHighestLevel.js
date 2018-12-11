/**
 * Created by dmitrii on 7.9.18.
 */
function convolution(arr){
    let new_arr = arr.reduce((prev,next) => prev.concat(next));
    return new_arr;
}

console.log(convolution([[1,2,3],[4,5],[6]]));