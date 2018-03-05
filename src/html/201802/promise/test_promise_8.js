/**
 * Created by xiaozhu on 2018/3/1.
 */
Promise.resolve(1)
    .then(1)
    .then(Promise.resolve(3))
    .then(console.log)

/*
* 运行结果
* 1
* 解释：.then 或者 .catch 的参数期望是函数，传入非函数则会发生值穿透。
*
* */
/*如then返回时数值，会被封装为promise，新处理结束后的回调函数的参数是2*/
Promise.resolve(1)
    .then(()=>{
        return 2;
    })
    .then(Promise.resolve(3))
    .then(console.log)

/*
 * 运行结果
 * 2
 *
 * */