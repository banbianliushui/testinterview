/**
 * Created by xiaozhu on 2018/3/1.
 */
const promise = Promise.resolve()
.then(() =>{
    return promise
})
promise.catch((err)=>{
    console.error(err)
})
/*
* 运行结果
* TypeError: Chaining cycle detected for promise #<Promise>
 at resolvePromise (native)
 at process._tickCallback (internal/process/next_tick.js:103:7)

解释：.then 或 .catch 返回的值不能是 promise 本身，否则会造成死循环。
 * */