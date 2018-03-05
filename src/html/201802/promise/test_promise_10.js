/**
 * Created by xiaozhu on 2018/3/1.
 */
process.nextTick(() =>{
    console.log('nextTick')
})
Promise.resolve()
.then(() =>{
    console.log('then')
})
setImmediate(()=>{
    console.log('setImmediate')
    })
    console.log('end')

    /*运行结果
    *end
     nextTick
     then
     setImmediate

     *解释：process.nextTick 和 promise.then 都属于 microtask，
     * 而 setImmediate 属于 macrotask，在事件循环的 check 阶段执行。
     * 事件循环的每个阶段（macrotask）之间都会执行 microtask，
     * 事件循环的开始会先执行一次 microtask。
    *
    * */



Promise.resolve()
    .then(() =>{
        console.log('then')
    })
process.nextTick(() =>{
    console.log('nextTick')
})

setImmediate(()=>{
    console.log('setImmediate')
})
console.log('end')

/*


 运行结果
 *end
 nextTick
 then
 setImmediate


两者一起执行的结果是：
 end
 end
 nextTick
 nextTick
 then
 then
 setImmediate
 setImmediate

* process.nextTick 永远大于 promise.then，原因其实很简单。。。在Node中，_tickCallback在每一次执行完TaskQueue中的一个任务后被调用，而这个_tickCallback中实质上干了两件事：

 1.nextTickQueue中所有任务执行掉(长度最大1e4，Node版本v6.9.1)

 2.第一步执行完后执行_runMicrotasks函数，执行microtask中的部分(promise.then注册的回调)

 所以很明显 process.nextTick > promise.then

 https://segmentfault.com/q/1010000011914016


 setTimeout 注册的回调会在事件循环的 timers、poll 和 closing callbacks 阶段执行。
 需要注意的是，计时器默认定义的 TIMEOUT_MAX 的取值范围是 [1, 2 ^ 31 - 1]，不足 1 或者超过上限都会初始化为 1，
 也就是说你调用 setTimeout(fn, 0) 和 setTimeout(fn, 1) 的效果是一样的。

 process.nextTick 注册的回调会在事件循环的当前阶段结束前执行，而不是只有 poll、check 阶段才会执行。
 process 是内核模块，运行时是全局上下文，所以 microtask 只有一个，无论你是在哪个阶段、哪个闭包内用
 nextTick 注册的回调都会被 push 到nextTickQueue，并在事件循环当前阶段结束前执行。

 setImmediate 注册的回调会在 check 阶段、check 阶段、check 阶段执行。
 因为它需要由 check watcher 来执行，check watcher 只在 check 阶段处于 active 状态。
 与 process.nextTick 不同，setImmediate 因运行时的上下文不同而产生不同的 ImmediateList，
 所以 macrotask 可以有多个。setImmediate 会在异常的时候执行 process.nextTick(processImmediate)，
 会在当前阶段结束前重新执行一次这个异常任务（即 check 阶段）。
 https://cnodejs.org/topic/58d7d2f26f8b9bf02d1d0b1b
* */