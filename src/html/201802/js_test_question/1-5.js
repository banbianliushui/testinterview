/**
 * Created by xiaozhu on 2018/4/15.
 */
/*题目1 JS基础-连续赋值*/
var a = {n: 1};

var b = a;

a.x = a = {n: 2};

console.log(a.x);
console.log(b.x);
/*根据js引擎语法解析，会先去从左到右寻找有没有未声明的变量，如果有就把该变量提升至作用域顶部并声明该变量。那么恭喜js引擎他找到a.x这个属性没有声明，那么他会在{n: 1}这个内存区声明一个x属性等待赋值！

语法解析完成后，开始进行运算(ps：赋值运算),首先将a变量的指针指向了一个新的内存区{n: 2},那么a变量脱离了对内存区{n: 1}的引用关系。

但是此时{n:1 }这个内存区并没有被GC回收因为b变量的指针依然指向它。并且因为之前就声明了x属性所以该内存区
增加了X属性。那么X属性指向哪儿呢？a.x = a = {n: 2}它的返回值就是{n: 2}的内存区。*/


/*题目2 http://www.cnblogs.com/yexiaochai/p/4366051.html*/
var F = function(){};
Object.prototype.a = function(){};
Function.prototype.b = function(){};
var f = new F();

/*f.constructor可以同时拿到a和b*/
/*http://www.cnblogs.com/yexiaochai/p/4366051.html*/
var a = {x:{xx:1},y:2,z:3};
var b = a.x;

a.x.xx = {x:10,y:20};
a = {x:10,y:20};

console.log(a); //a重新指向新的
console.log(b); //b还是指向最初的a.x 》{xx:1}，后来a.x.xx 》{xx:{x:10,y:20}}