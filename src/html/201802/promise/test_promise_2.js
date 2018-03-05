/**
 * Created by xiaozhu on 2018/3/1.
 */
const promise1 = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve('success')
    },1000)
})
const promise2 = promise1.then(()=>{
    throw new Error('error!!')
})
promise2.catch(function(err){
    console.log("err",err)
})
console.log('promise1',promise1)
console.log('promise2',promise2)

setTimeout(() => {
    console.log('promise1',promise1);
    console.log('promise2',promise2)
},2000)
/*
*运行结果：

 promise1 Promise { <pending> }
 promise2 Promise { <pending> }
 (node:50928) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): Error: error!!!
 (node:50928) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
 promise1 Promise { 'success' }
 promise2 Promise {
 <rejected> Error: error!!!
 at promise.then (...)
 at <anonymous> }
 解释：promise 有 3 种状态：pending、fulfilled 或 rejected。状态改变只能是 pending->fulfilled
 或者 pending->rejected，状态一旦改变则不能再变。
 上面 promise2 并不是 promise1，而是返回的一个新的 Promise 实例。
* */