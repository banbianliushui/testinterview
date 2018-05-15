/**
 * Created by xiaozhu on 2018/5/14.
 */


class CustomHtmlElement{
    constructor(ele){
        this.elem = ele;
    }
    get html(){}
    set html(value){
        this.elem.innerHTML = value;
    }
}

var descriptor = Object.getOwnPropertyDescriptor(CustomHtmlElement.prototype,'html')
console.log("get" in descriptor)


/*Object.setPrototypeOf = function(obj,proto){
    obj.__proto__= proto;
    return obj;
}*/

/*class A{}
console.log(A)
class B extends A{

}

console.log(B.prototype.__proto__ == A.prototype)*/

/*


class Person{
    age = 10;
    constructor(name){
        this.name = name;
        this.speak = (x) => {
            console.log(this.age);
            console.log(this.name+" speak"+"  ")
        }
    }
    say (){
        console.log(this.name+" say"+'')
    }

    /!* speak = (x) => {
     //等同于construtor中的函数，是它的语法糖，This syntax is not an official part of the JavaScript language yet (currently in stage 2)
     console.log(this.name+" speak"+"  ")
     }*!/
}

new Person('daxi')*/
