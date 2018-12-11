/**
 * Created by dmitrii on 24.9.18.
 */
/*function MultiplicatorUnitFailure() {}

function primitiveMultiply(a, b) {
    if (Math.random() < 0.5)
        return a * b;
    else
        throw new MultiplicatorUnitFailure();
}

function reliableMultiply(a, b) {
    try {
        return primitiveMultiply(a, b);
    } catch (e) {
        if (e instanceof MultiplicatorUnitFailure){
            return reliableMultiply(a, b);
        }
    }
}
for (var i = 0; i < 100000; i++)
console.log(reliableMultiply(8, 8));
// → 64
    */


var box ={
    locked: true,
    unlock: function () { this.locked = false; },
    lock: function () { this.locked = true; },
    _content: [],
    get content() {
        if (this.locked) throw new Error("Заперто!");
        return this._content;
    }
};
function  withBoxUnlocked(body) {
    if (box.locked == true) {
        box.unlock();
    }
    try {
        body();
    } catch (e){

    }
    box.lock();
}

withBoxUnlocked(function () {
    box.content.push("золотишко");
});

try {
    withBoxUnlocked(function () {
        throw new Error("Пираты на горизонте! Отмена!");
    });
} catch (e){
    console.log("Произошла ошибка:", e);
}
console.log(box.locked);