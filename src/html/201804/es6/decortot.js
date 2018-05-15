/**
 * Created by xiaozhu on 2018/5/14.
 */
/*修饰器*/

function testable(isTestable){
    return function(target){
        target.isTestable = isTestable;
    }
}

@testable(true)
class MyTestableClass{
}

console.log(MyTestableClass.isTestable)



class Person{
    @readonly
    name(){
        return `${this.first}`
    }
}

function readonly(target,name,descriptor){
    descriptor.writable = false;
    return descriptor;
}