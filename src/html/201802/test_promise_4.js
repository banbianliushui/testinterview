/**
 * Created by xiaozhu on 2018/3/1.
 */
promise.resolve(1)
.then((result) => {
    console.log(res)
    return 2
})
.catch((err) =>{
    return 3
})
.then((res) => {
    console.log(res)
})

/*
* 运行结果：
* 1
* 2
*
* 解释：promise 可以链式调用。promise每次调用.then或.catch 都会返回一个新的promise，
* 从而实现链式调用
*
* */