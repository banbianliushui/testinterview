/*https://html.spec.whatwg.org/multipage/web-sockets.html*/
var socket = new WebSocket("ws://127.0.0.1:12010/updates");
socket.onopen=function(){

    setInterval(function(){
        if(socket.bufferedAmount == 0){
            socket.send("哈哈哈");
            /*
            * var socket = new WebSocket('ws://game.example.com:12010/updates');
             socket.onopen = function () {
             setInterval(function() {
             if (socket.bufferedAmount == 0)
             socket.send(getUpdateData());
             }, 50);
             };
            * *//*
            * The bufferedAmount attribute must return the number of bytes of application data (UTF-8 text and binary data) that have been queued using send() but that, as of the last time the event loop reached step 1, had not yet been transmitted to the network. (This thus includes any text sent during the execution of the current task, regardless of whether the user agent is able to transmit text in the background in parallel with script execution.) This does not include framing overhead incurred by the protocol, or buffering done by the operating system or network hardware.
            * */
            /*The bufferedAmount attribute can also be used to saturate the network without sending the data at
             a higher rate than the network can handle, though this requires more careful monitoring of the value of the attribute over time.*/
            /*也可以使用bufferedAmount属性来使网络饱和，而不以比网络可处理的速率更高的速率发送数据，但这需要更仔细地监控属性值随时间的变化。*/
            /*bufferedAmount属性用于确保更新每50ms发送一次更新，如果网络可以处理该速率，或者以网络可以处理的速度发送更新（如果速度过快）。*/
        }
    },50)
}