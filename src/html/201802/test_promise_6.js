/**
 * Created by xiaozhu on 2018/3/1.
 */
/*http://www.bslxx.com/a/mianshiti/tiku/javascript/2017/1213/1505.html*/
Promise.resolve()
.then(() => {
    return new Error("error!!")
} )
.then((res) => {
    console.log('then:',res)
})
.catch((err) =>{
    console.log('catch:',err)
})
/*
* 运行结果
*then: Error: error!!
 at Promise.resolve.then (D:\nodeworkspace\testInterviews\src\html\201802\test_promise_6.js:7:12)
 at process._tickCallback (internal/process/next_tick.js:103:7)
 at Module.runMain (module.js:606:11)
  at ...

  解释：.then 或者 .catch 中 return 一个 error 对象并不会抛出错误，所以不会被后续的 .catch 捕获，
  需要改成其中一种：

 return Promise.reject(new Error('error!!!'))

 throw new Error('error!!!')
 因为返回任意一个非 promise 的值都会被包裹成 promise 对象，即 return new Error('error!!!') 等价于 return Promise.resolve(new Error('error!!!'))。
 * */