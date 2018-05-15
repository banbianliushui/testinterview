/**
 * Created by xiaozhu on 2018/4/16.
 */

/*对象单个属性响应*/
function cb() {
    console.log("更新视图啦")
}

function defineReative(obj,key,val){

    Object.defineProperty(obj,key,{
        configure:true,
        enumerable:true,
        get:function reativeGetter(){
            //依赖收集
            return val;
        },
        set: function reativeSetter(newVal){
            //响应
            if(newVal !== val){
                val = newVal
            }
            cb(newVal)//更新视图
        }
    })
}

function observer (val){

    Object.keys(val).forEach(function( key,index,obj){
        defineReative(val,key,val[key]);
    })
}



class Vue{
    constructor(options){
        this._data = options.data;
        observer(this._data);
    }
}

var vm= new Vue({data:{a:1,b:'哈哈'}});
vm._data.a = '你好';