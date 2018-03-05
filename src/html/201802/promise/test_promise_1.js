/**
 * Created by xiaozhu on 2018/3/1.
 */
/*new Promise构造函数传的参数是同步执行的，可参考test_promise3.html的实现，传递的参数函数在new时立即执行
* ，调then时then的参数被异步加入（实际是微任务）回调队列
* */
const promise = new Promise((resolve,reject) => {
    console.log(1);
    resolve();
    console.log(2);
})
promise.then(()=>{
    console.log(3)
})
console.log(4)

/*
* 运行结果：

 1
 2
 4
 3
 解释：Promise 构造函数是同步执行的，promise.then 中的函数是异步执行的。
* */