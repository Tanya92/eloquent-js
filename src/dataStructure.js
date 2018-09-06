function  range(one,two,step = one < two? 1: -1) {
    let arr = [];
    if (step > 0) {
        for (let i = one; i <= two; i += step){
        arr.push(i);
        }
    } else {
        for (let i = one; i >= two; i += step){
            arr.push(i);
        }
    }

    return arr;
}

function sum(arr){
    let sum = 0;
    for (let i = 0; i < arr.length; i++){
        sum +=arr[i];
    }
    return sum;
}

function reverseArray(arr){
   let new_arr = [];
   for (let i = arr.length-1; i >= 0; i--){
       new_arr.push(arr[i]);
   }
   return new_arr;
}

function reverseArrayInPlace(arr){
    let half_length = Math.floor(arr.length/2);
    let last_index = arr.length - 1;
    for (let i = 0; i < half_length; i++){
      let old = arr[i];
      arr[i] = arr[last_index - i];
      arr[last_index - i] = old;
    }
    return arr;
}
console.log(
    reverseArrayInPlace(
        range(5,10)
    )
);