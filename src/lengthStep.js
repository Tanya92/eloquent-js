/**
 * Created by dmitrii on 7.12.18.
 */
function lengthStep(length, pointCount) {
    return Math.round(length / (pointCount - 1));
}

console.log(lengthStep(260, 8));