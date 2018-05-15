var s1 = Symbol('foo');
var s2 = Symbol('bar');
var s3 = Symbol('bar');

console.log(s1);
console.log(s2.toString());
console.log(s2==s3)

var mysymbol = Symbol();

var a = {};
a[mysymbol] = 'hello';
console.log(a[mysymbol]);
var a={
    [mysymbol]:'你好'
}
console.log(a[mysymbol]);
var a = {};
Object.defineProperty(a,mysymbol,{
    value:'啦啦啦'
})
console.log(a[mysymbol]);

console.log(a.mysymbol);


var s11 = Symbol.for('foo');
var s12 = Symbol.for('foo');
console.log(s11 == s12);

//Symbol.hasInstance
console.log("--------------------------------------")
class MyClass{
    [Symbol.hasInstance](foo){
        return foo instanceof Object  ;
    }
}

var  o = new MyClass();
console.log(o instanceof Array)

let arr1 =['2','3']
console.log(['s','b'].concat(arr1,'4'));

let arr2 = ['5','r'];
arr2[Symbol.isConcatSpreadable] = false;
console.log(['y','9'].concat(arr2,'34'));


/*class mySpecies{
    constructor(){

    }

}*/

class MyArray extends Array{
    static get [Symbol.species](){
        return Array;
    }
}
var a = new MyArray(1,2,3);
var mapped = a.map(x=> x*x);
console.log(mapped instanceof  MyArray)
console.log(mapped instanceof  Array)
//var oo1 = new o1('大于');
//console.log(oo1);


const it = {};
it[Symbol.iterator] = function *(){
    yield 1;
    yield 2;
}

console.log([...it]);