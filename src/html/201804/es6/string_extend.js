/**
 * Created by xiaozhu on 2018/4/29.
 */

var s = "𠮷a";
console.log(s.charAt(0));
console.log(s.charAt(1));
console.log(s.charCodeAt(0));
console.log(s.charCodeAt(1));
console.log("-------------------------------------------")
console.log(s.codePointAt(0));
console.log(s.codePointAt(1));
console.log(s.codePointAt(2));
for(let c  of s){
    console.log(c.codePointAt(0).toString(16))
}

console.log("-------------------------------------------")
console.log("\u0061")
console.log("\uD842\uDFB7")
console.log("\u20BB7")// \u20BB+7
console.log("\u{20BB7}")
console.log("\u{41}")