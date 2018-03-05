/**
 * Created by xiaozhu on 2018/3/1.
 */
const promise = new Promise((resolve,reject) => {
    setTimeout(() => {
        console.log('once');
        resolve('success');
    },1000)
})
const start = Date.now()
promise.then((result) =>{
    console.log(result,Date.now() - start)
})
promise.then((result) =>{
    console.log(result,Date.now() - start)
})
/*
* 运行结果：
* once
 success 1079
 success 1081

 解释：promise 的 .then 或者 .catch 可以被调用多次，但这里 Promise 构造函数只执行一次。
 或者说 promise 内部状态一经改变，并且有了一个值，
 那么后续每次调用 .then 或者 .catch 都会直接拿到该值。
 * */