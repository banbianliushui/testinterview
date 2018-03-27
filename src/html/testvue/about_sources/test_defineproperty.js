    /*----------1.对象定义属性-------------*/
    var obj = {
        name:'大白',
        set  age (val){
            this._age = val
        },
        get   age (){//不能这么写： get : function age(){}  这不表示取age属性
            return this._age;
        }
    }

    Object.defineProperty(obj,'sex',{
        set : function sex1 ( val){//此处可以这么写，因为第二个参数表明对sex属性添加 set 和get访问器
            this._sex = val;
        },
        get (){
            return this._sex;
        }
    })

    var propertydesc = Object.getOwnPropertyDescriptor(obj,'name');

    /*
    propertydesc.value
    propertydesc.writable 可写性决定是否可以修改属性的值
    propertydesc.enumerable  可枚举性决定属性是否出现在对象的属性枚举中，具体来说，for-in循环、Object.keys方法、JSON.stringify方法是否会取到该属性
    propertydesc.configurable 　可配置性决定是否可以使用delete删除属性，以及是否可以修改属性描述符的特性，默认值为true
                                    一个例外，设置Configurable:false后，只允许writable的状态从true变为false
    propertydesc.set
    propertydesc.get
    */
    console.log(propertydesc)
    obj.age = 10;
    console.log(obj.age)
    obj.sex = '男';
    console.log(obj.sex)


    var propertydesc = Object.getOwnPropertyDescriptor(obj,'name');
    if(propertydesc.configurable){

    }
    var getter = propertydesc&&propertydesc.get;
    var setter = propertydesc&&propertydesc.set;

    Object.defineProperty(obj,'name',{
        set (v){//设置对象属性时劫持，此函数内可以做关于该属性的后续跟踪处理

            setter ? setter.call(this,v) :propertydesc.value = v;
        },
        get (){//获取对象属性时劫持

           var val = getter ? getter.call(this): propertydesc.value;
           return val;
        }
    })

    console.log(obj.name)   ;
    obj.name='四木';
    console.log(obj.name)   ;

    var obj1 ={
        a:5,
        b:6,
        c:7
    }
    Object.defineProperty(obj1,Symbol.iterator,{
        enumerable:false,
        writable:false,
        configurable:true,
        value:function(){
            var o = this , id =0,keys = Object.keys(o);
            return {
                next : function () {
                    return {
                        value :o[keys[id++]],
                        done :(id>keys.length)
                    }

                }
            }
        }
    })



    var it =obj1[Symbol.iterator]();

    console.log(it.next(),"手动迭代")
    console.log(it.next(),"手动迭代")
    console.log(it.next(),"手动迭代")
    console.log(it.next(),"手动迭代")
    console.log(it.next(),"手动迭代")

    //for of  遍历
    for(var v of obj1){
         console.log(v,"forof");
     }

    //for of  遍历
    for(var v in obj1){
        console.log(v,obj1[v],"forin");
    }




      var pushmethod={}
      var result = [];
      Object.defineProperty(pushmethod,'push',{
          value: function (){
              console.log(arguments)
              result.push(arguments);
              return result;
          }
      })

    pushmethod.push('ccc')
    console.log(pushmethod)
    /*
    * 参考：
    * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor
    * https://www.cnblogs.com/xiaohuochai/p/5743821.html
    * https://www.cnblogs.com/chengyunshen/p/7277364.html
    *
    * */