// const hello : string = "hola!"
// console.log(hello)
var a; //任意
var b; //数字
var c; //boolean
var d = []; //数组
var e = []; //数组
var f; //元组: 元组类型用来表示已知元素数量和类型的数组，各元素的类型不必相同，对应位置的类型需要相同。
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {})); // 枚举
var g = Color.Blue;
//void
function hello() {
    alert('void');
}
// other: null | undefined | never
var h = 1;
var i = 2;
var j = 3;
var myMap = new Map([
    ["key1", "value1"],
    ["key2", "value2"]
]);
var customer = {
    firstName: "Tom",
    lastName: "Hanks",
    sayHi: function () { return "Hi there"; }
};
