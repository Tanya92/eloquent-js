var obj = { a: 1};

function sumObj(b) {
    return this.a  + b
}

function sum(a,b) {
    return a + b
}

console.log(
    sumObj.call(obj, 2),
    sum.call(null, 1, 2),

    sumObj.apply(obj, [2]),
    sum.apply(null, [1,2]),

    sumObj.bind(obj)(2),
    sum.bind(null)(1,2),


    sum.bind(null, 1,2)()
);