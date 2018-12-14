/**
 * Created by dmitrii on 4444.10.18.
 */
function parseExpression(program) {
    program = skipSpace(program);
    var match, expr;
    if (match = /^"([^"]*)"/.exec(program))
        expr = {type: "value", value: match[1]};
    else if (match = /^\d+\b/.exec(program))
        expr = {type: "value", value: Number(match[0])};
    else if (match = /^[^\s(),"]+/.exec(program))
        expr = {type: "word", name: match[0]};
    else
        throw new SyntaxError("Неожиданный синтаксис: " + program);

    return parseApply(expr, program.slice(match[0].length));
}

function skipSpace(string) {
    var first = string.search(/\S/);
    if (first == -1) return "";
    var current = string.slice(first);
   if (current[0] == "#"){
       var posEnd = current.search(/\n/);
       return skipSpace(current.slice(posEnd));
   }
   return current;
}

function parseApply(expr, program) {
    program = skipSpace(program);
    if (program[0] != "(")
        return {expr: expr, rest: program};
    program = skipSpace(program.slice(1));
    expr = {type: "apply", operator: expr, args: []};
    while (program[0] != ")") {
        var arg = parseExpression(program);
        expr.args.push(arg.expr);
        program = skipSpace(arg.rest);
        if (program[0] == ",")
            program = skipSpace(program.slice(1));
        else if (program[0] != ")")
            throw new SyntaxError("Ожидается ',' or ')' ");
    }
    return parseApply(expr, program.slice(1));
}

function parse(program) {
    var result = parseExpression(program);
    if (skipSpace(result.rest).length > 0)
        throw new SyntaxError("Неожиданныйй текст после программы");
    return result.expr;
}
console.log(parse("+(a, 10)"));


function evaluate(expr, env) {
    switch(expr.type) {
        case "value":
            return expr.value;
        case "word":
            if (expr.name in env)
                return env[expr.name];
            else
                throw new ReferenceError("Неопределенная переменная:" + expr.name);
        case "apply":
            if (expr.operator.type == "word" && expr.operator.name in specialForms)
                return specialForms[expr.operator.name](expr.args, env);
            var op = evaluate(expr.operator, env);
            if (typeof op != "function")
                throw new TypeError("приложение не является функцией.");
            return op.apply(null, expr.args.map(function (arg) {
                return evaluate(arg, env);
            }));
    }
}
var specialForms = Object.create(null);
specialForms["if"] = function (args, env) {
    if (args.length != 3)
        throw new SyntaxError("Неправильное количество аргументов для if");

    if (evaluate(args[0], env) !== false)
        return evaluate(args[1], env);
    else
        return evaluate(args[2], env);
};
specialForms["while"] = function (args, env) {
    if (args.length != 2)
        throw new SyntaxError("Неправильное количечство аргументов для while");

    while (evaluate(args[0], env) !== false)
    evaluate(args[1], env);

    return false;
};
specialForms["do"] = function (args, env) {
    var value = false;
    args.forEach(function (arg) {
        value = evaluate(arg, env);
    });
    return value;
};
specialForms["define"] = function (args, env) {
    if (args.length != 2 || args[0].type != "word")
        throw new SyntaxError("Bad use of define");
    var value = evaluate(args[1], env);
    env[args[0].name] = value;
    return value;
};

specialForms["set"] = function(args, env) {
    if (args.length != 2 || args[0].type != "word")
        throw new SyntaxError("Bad use of set");
    var value = evaluate(args[1], env);
    var currentPr = env;
    while (currentPr) {
        if (Object.prototype.hasOwnProperty.call(currentPr, args[0].name)){
           return currentPr[args[0].name] = value;
        }
        currentPr = Object.getPrototypeOf(currentPr);
    }
    throw new ReferenceError("Переменная" + args[0].name + " не задана");
};
var topEnv = Object.create(null);

topEnv["true"] = true;
topEnv["false"] = false;
var prog = parse("if(false, false, true)");
console.log(evaluate(prog, topEnv));
["+", "-", "*", "/", "==", "<", ">"].forEach(function (op) {
    topEnv[op] = new Function("a, b", "return a " + op + " b;");
});
topEnv["print"] = function (value) {
    console.log(value);
    return value;
};

function run(){
    var env = Object.create(topEnv);
    var program = Array.prototype.slice.call(arguments, 0).join("\n");
    return evaluate(parse(program), env);
}

run("do(define(total, 0),",
    "   define(count, 1),",
    "   while(<(count, 11),",
    "         do(define(total, +(total, count)),",
    "            define(count, +(count, 1)))),",
    "   print(total))");
specialForms["fun"] = function (args, env) {
    if (!args.length)
        throw new SyntaxError("Функции нужно тело");
    function name(expr) {
        if (expr.type != "word")
            throw new SyntaxError("Имена аргументов должны быть типа Word");
        return expr.name;
    }
    var argNames = args.slice(0, args.length - 1).map(name);
    var body = args[args.length - 1];

    return function(){
        if (arguments.length != argNames.length)
            throw new TypeError("Неверное количество аргументов");
        var localEnv = Object.create(env);
        for (var i = 0; i < arguments.length; i++)
            localEnv[argNames[i]] = arguments[i];
        return evaluate(body, localEnv);
    };
};
run("do(define(plusOne, fun(a, +(a, 1))),",
    "   print(plusOne(10)))");
// → 11

run("do(define(pow, fun(base, exp,",
    "     if(==(exp, 0),",
    "        1,",
    "        *(base, pow(base, -(exp, 1)))))),",
    "   print(pow(2, 10)))");
// → 1024
topEnv["array"] = function (...args) {
    var arr = new Array();
    for (let i = 0; i < args.length; i++){
        arr.push(args[i]);
    }
    return arr;
};
topEnv["length"] = function (arr) {
    return arr.length;
};
topEnv["element"] = function (arr, n) {
    return arr[n];
};

run("do(define(sum, fun(array,",
    "     do(define(i, 0),",
    "        define(sum, 0),",
    "        while(<(i, length(array)),",
    "          do(define(sum, +(sum, element(array, i))),",
    "             define(i, +(i, 1)))),",
    "        sum))),",
    "   print(sum(array(1, 2, 3))))");
// → 6

console.log(parse("# hello\nx"));
// → {type: "word", name: "x"}

console.log(parse("a # one\n   # two\n()"));
// → {type: "apply",
//    operator: {type: "word", name: "a"},
//    args: []}
run("do(define(x, 4),",
    "   define(setx, fun(val, set(x, val))),",
    "   setx(50),",
    "   print(x))");
// → 50
run("set(quux, true)");
// → Ошибка вида ReferenceError