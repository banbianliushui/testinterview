/**
 * Created by xiaozhu on 2018/5/30.
 */


//https://www.nowcoder.com/questionTerminal/b58a27e6bb22473bae2419367a00d52d

// 这种方法无法避免原型链对象共享问题。 使用extend类似， for in 循环prototype中属性 拷贝
function inheritObject(o) {
    function F() {}
    F.prototype=o;
    return new F();
}

function inheritPrototype(sub, Super) {
    var p=inheritObject(Super.prototype);
    p.constructor=sub;
    sub.prototype=p;
}

function Super(name) {
}
Super.prototype.grocylist=[];
function Sub(name, time) {
    Super.call(this, name);
}

inheritPrototype(Sub, Super);

var s1 = new Sub();
s1.grocylist.push("第一个")
var s2 = new Sub();
s2.grocylist.push("第二个")
console.log(s1);
console.log(s2);
/*function Parent(){

}
Parent.prototype.grocelist=[];

function CreatePro(prop){
    var f = function(){};
    f.prototype = prop;
   return  new f();
}

function Child(){

}
Child.prototype = CreatePro(Parent.prototype);
var ch1 = new Child();
ch1.grocelist.push("大名")
var ch2 = new Child();
ch2.grocelist.push("小丽")

console.log(ch1);
console.log(ch2);*/
/*console.log(1+true);//2
console.log(""+true);//'true'
var o = {};
//console.log(1+{});//NAN  对象.tostring()  p48 高程
console.log(1+o);
const Cf = function () {
    this.toString = () =>'2'
}

console.log(1+Cf);//  NAN 错   -》  fun.toString
console.log(1+new Cf()) // tostring  =>  ‘12’
const Cf2 = function () {
    this.toString=() => '2';
    this.valueOf = () => 2
}


console.log(1+new Cf2())// 3

console.log(1+ new Date())// gettime+1  错*/


/*setTimeout(function () {
    console.log(4)
},0)

new Promise(function(resolve){
    console.log(1);
    for(var i =0;i<10000;i++){
        i==9999&&resolve()
    }
    console.log(2)
}).then(function () {
    console.log(5)
})
console.log(3);*/

// 1,2,3,5,4

/*let x = [1,2];
let {...y} = x;
console.log(y)
console.log(x)


function add (...values){
     console.log(values)
}

add(8,2,3)

function add1 (...values){
    console.log(values)
}

add1([4,5,6])*/
