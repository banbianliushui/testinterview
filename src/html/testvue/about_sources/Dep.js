/*订阅者，维护观察者
* 一个对象的每个属性都有一个订阅者，维护多个watcher
* */
class Dep{
    constructor(){
        this.subs=[];
    }
    addSub (sub){
        this.subs.push(sub)
    }
    notify(param){
        this.subs.forEach( (sub) =>{
            sub.update(param);
        })
    }
}

/*观察者*/
class Watcher{
    constructor(){
        Dep.target=this;//此处为什么？
    }
    update(param){
        console.log(param,"观察者更新")
    }
}
Dep.target = null;
function defineReative(obj,key,val){
    var dep = new Dep();//对象的每个属性对应一个订阅者，
    Object.defineProperty(obj,key,{
        configurable:true,
        enumerable:true,
        set :function defineSetter(newVal) {//订阅者发布通知，通知观察者
            if(newVal!==val){
                dep.notify(newVal);
            }

        } ,
        get : function defineGetter(){//将观察者加入订阅者中

            dep.addSub(Dep.target);//当前的watcher对象
            return val;
        }
    })
}
function observer(obj){//这里可能还要处理嵌套属性
    //Object.keys 返回一个所有元素为字符串的数组，其元素来自于从给定的object上面可直接枚举的属性。
    Object.keys(obj).forEach((key,val) =>{
        defineReative(obj,key,obj[key]);
    })
}

class Vue{
    constructor(options){
        this._data = options.data;
        observer(this._data);
        new Watcher();

        /* 在这里模拟render的过程，为了触发test属性的get函数 */
        console.log('render~', this._data.a);
    }
}

var t ={
    a:'5t',
    b:'哈哈'
}
var vm =new Vue({data:t});
t.a='pp';
//t.b='新的 f';
t.a='dav';
t.a='xin';
console.log('测试')

/*测试时debug模式下dep中维护的subs多了null，不知道哪里来的，浏览器时正常的*/