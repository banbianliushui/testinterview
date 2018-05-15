/**
 * Created by xiaozhu on 2018/4/14.
 */
/*https://stackoverflow.com/questions/48920135/es6-functions-arrow-functions-and-this-in-an-es6-class*/

class Person{
    constructor(name){
        this.name = name;
        this.speak = (x) => {
            console.log(this.name+" speak"+"  ")
        }
    }
    say (){
        console.log(this.name+" say"+'')
    }

   /* speak = (x) => {
   //等同于construtor中的函数，是它的语法糖，This syntax is not an official part of the JavaScript language yet (currently in stage 2)
        console.log(this.name+" speak"+"  ")
    }*/
}
var person = new Person('小明')
person.say();
person.speak('hah')
console.log("哈哈哈")

/*class A {
    method = () => {console.log("啊哈哈哈")}
}*/
/*
class A {
    constructor() {
        this.method = () => {
            console.log("啊哈哈哈")
        }
    }
}
var a =new A()
a.method();
console.log("dkfj")
*/

