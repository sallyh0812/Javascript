"use strict"; //strict mode (不可以用八進位)

var i; //global (window.i == i)

////////////////////////////

document.write("type of undefined is " + typeof undefined) // undefined
document.write("type of null is " + typeof null) // object
null === undefined // false
null == undefined // true

////////////////////////////////

NaN == NaN //false
isNaN(10) //false
isNaN("10") //false
isNaN(true) //false



