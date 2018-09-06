function chessBoard(size) {
    let res = "";
    let length = Math.pow(size,2) + size - 1;
    while (res.length < length) {
        if (res.length % 2 == 0) {
            res += "#";
        } else {
            res += " "
        }
        if ((res.length + 1) % (size + 1) == 0) {
            res += "\n"
        }
    }
    return res;
}
console.log(chessBoard(10));
