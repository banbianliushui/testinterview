/**
 * Created by xiaozhu on 2018/3/1.
 */
Promise.resolve()
.then(function success(res){
    throw new Error('error')
},function fail(e){
    console.error('fail',e)
})
.catch(function fail2(e){
    console.error("fail2:",e)
})
/*
*运行结果
* fail2: Error: error
 at success (D:\nodeworkspace\testInterviews\src\html\201802\test_promise_9.js:6:11)

 解释：.then 可以接收两个参数，第一个是处理成功的函数，第二个是处理错误的函数。.catch 是 .then 第二个参数的简便写法，但是它们用法上有一点需要注意：.then 的第二个处理错误的函数捕获不了第一个处理成功的函数抛出的错误，而后续的 .catch 可以捕获之前的错误。当然以下代码也可以：

 Promise.resolve()
 .then(function success1 (res) {
 throw new Error('error')
 }, function fail1 (e) {
 console.error('fail1: ', e)
 })
 .then(function success2 (res) {
 }, function fail2 (e) {
 console.error('fail2: ', e)
 })
*
* */