// Define variables for each data type
var num = 10;
var bigInt = 123456789012345678901234567890n;
var str = "Hello, world!";
var bool = true;
var n = null;
var undef;
var obj = {name: "Darvin", age: 30};
var sym = Symbol("foo");
var func = function() {};

// Display variable names and data types using alert() method
alert("num is " + typeof num + "\n" +
"bigInt is " + typeof bigInt + "\n" +
"str is " + typeof str + "\n" +
"bool is " + typeof bool + "\n" +
"n is " + typeof n + "\n" +
"undef is " + typeof undef + "\n" +
"obj is " + typeof obj + "\n" +
"sym is " + typeof sym + "\n" +
"func is " + typeof func);