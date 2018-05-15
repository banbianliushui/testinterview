/*https://zhuanlan.zhihu.com/p/25178630*/
var PENDING = 0;
var FULFILLED =1 ;
var REJECTED = 2;
function Promise(fn){ //fn一般是包含异步处理的函数
    if( typeof this !=='object'){// new 后this指向新变量对象
        throw new TypeError("promises must bu constructed via new");
    }
    if(typeof fn !=='function'){
        throw new TypeError("fn must be a function");
    }
    var state = PENDING;
    var value = null;
    var handlers =[];

    //这个fn 可能是用户new promise（fn）传进来的，也可能是用户调用resolve传入的promise
    //onFulfilled,onRejected 用于处理用户（或then）resolve或reject传的参数
    function doResolve(fn,onFulfilled,onRejected){
        var done = false;
        try{
            //此处的fn 是用户传入的带简单参数的函数(如例子中的带参数success,fail的函数)，然后在这里立即执行
            // 或 then中return的promise对象的then函数（由getThen处理）
            //
            fn(function(value){//就是 fn(resolve,reject)
                //用户调用成功函数，传参value
                if(done) return ;
                done = true;
                onFulfilled(value);//用于后续处理传到后面then的对应函数参数中
            },function(reason){
                if(done) return;
                done = true;
                onRejected(reason);
            })
        }catch(e){
            if(done) return;
            done = true;
            onRejected(e);
        }
    }

    function getThen(value){//辅助判断是否是promise对象
        var t = typeof value;
        if(value &&(t==='object'||t === 'function')){
            var then = value.then;
            if(typeof then === 'function'){
                return then;
            }
        }
        return null;
    }
    function resolve(result){
        //resolve 用户函数fn处理后调用resolve，由doResolve转接到这里
        //result 用户回调函数处理后返回的结果
        try{
            var then = getThen(result);//用户resolve中传入的值，如果是promise的话，从它的then中拿到是完成还是拒绝中的值
            if(then){//传promise对象时
                //将then函数绑定到用户调用解决时传的promise对象上，立即执行
                //then.bind(result) 创建一个promise里面的this.done中this绑定result promise对象
                doResolve(then.bind(result),resolve,reject);
                //在doResolve运行完后会将then的结果result传回来给resolve，然后resolve被调用后再去用这个result值改变
                //上一个promise的状态，然后上一个promise就可以执行它的then了。
                return;
            }
            state = FULFILLED;
            value = result;
            handlers.forEach(handle);
            handlers = null;
        }catch(e){

        }
    }
    function reject(error){
        state = REJECTED;
        value = error;
        handlers.forEach(handle);
        handlers=null
    }
    function handle(handler){
        if(state === PENDING){
            handlers.push(handler);
        }else{
            if(state === FULFILLED && typeof handler.onFulfilled ==='function'){
                handler.onFulfilled(value);
            }
            if(state === REJECTED && typeof handler.onRejected === 'function'){
                handler.onRejected(value);
            }
        }
    }

    this.done = function(onFulfilled,onRejected){
        setTimeout(function(){//表示异步调用处理函数

            handle({
                onFulfilled:onFulfilled,
                onRejected:onRejected
            });
        },0)
    }
    //将用户添加的then中的两个处理函数存到handle处理列表中，
    //添加了then，promise内部自动创建一个新的promise，在它内立即调用done函数将用户注册的两个函数加入handle列表中。
    //只是这两个函数不是直接加入到handle，他需要将上一个promise返回的result传递给onFulfilled完成函数，
    //然后取注册的onFulfilled函数的返回值调用新创建的promise的resolve，
    this.then = function(onFulfilled,onRejected){
        var self = this;//promise对象同时也返回一个新promise对象

        return new Promise(function(resolve,reject){

            var done1= self.done(function(result){
                if(typeof onFulfilled === 'function' ){
                    try{
                        return resolve(onFulfilled(result));//
                    }catch(e){
                        return reject(e);
                    }
                }else{//用户then中未传参数
                    return resolve(result);
                }
            },function(error){
                if(typeof onRejected ==='function'){
                    try{
                        return resolve(onRejected(error));
                    }catch(e){
                        return reject(e);
                    }
                }else{
                    return reject(error);
                }
            });
            return done1;

        });
    }

    //fn用于转接处理，resolve在fn处理成功时调用，处理出错时调用reject。
    //而处理结束时决定回调resolve还是reject由用户fn 传的两个参数决定，
    //如果用户调用fn中的第一个参数则promise内部会调用resolve方法，
    //保证只进行一次状态改变(done=true)然后返回处理结果，供后续then获取
    doResolve(fn,resolve,reject);

}



/*
 var p = new Promise(function(success,fail){

 setTimeout(function(){
 console.log('第一个异步')
 //	resolve("hahha ");
 success("第一处");
 },2000)
 });
 p.then(function (value) {
 console.log("第一处返回值",value)
 return new Promise(function(success,fail){
 setTimeout(function(){
 console.log('第二个异步')
 //	resolve("hahha ");
 success("第二处");
 },1000)
 })
 },function () {

 }).then(function(result){
 console.log("succes2")
 console.log("第二处返回值",result)
 },function(error){
 console.log("fail2")
 console.log(error);
 })*/

var p1 = new Promise(function(resolve,reject){
    setTimeout(function(){
        resolve(new Promise(function(res,rej){//另一个promise，它完成后，p1从它的then中获取结果？

                res(1)

        }))
    },100)
})
p1.then(function(){//这两个函数分装过后被放在promise内部，放在p1的处理handle中，在p1被resolve时，调用
//调用then返回一个promise，方便链式调用，
    console.log(arguments)
},function(){
    console.log(arguments)
})/*.then(function(){},function(){
//以上then调用完后，内部还有处理不知道怎么回事？
})*/

// 每new一个promise都会执行doResolve。
//p1.then(onFulfilled,onRejected),onFulfilled完成函数中返回的是一个promise，则
