/**
 * Created by xiaozhu on 2018/3/1.
 */
const promise = new Promise((success,fail) =>{
     success("success1")
    fail("error")
    success("success2")
})
promise.then((result) =>{
    //console.log("then:",res);
    console.log("then:",result)
})
    .catch((err) =>{
        //如果then打印res：则这里截获报错： res is not defined
    console.log('catch:',err)
    })

/*
*运行结果：
 then: success1
 解释：构造函数中的 resolve 或 reject 只有第一次执行有效，
 多次调用没有任何作用，promise 状态一旦改变则不能再变。
* */