/**
 * Created by xiaozhu on 2018/7/18.
 */
//console.log(process.memoryUsage())
//console.log(os.totalmem())

var net = require('net')
var iconv = require('iconv-lite');
var server = net.createServer(function(socket){
    socket.on('data',function (data) {
       // socket.setEncoding("utf8")
        //
       // new Buffer('1111你好', '1111你好')

        socket.write( iconv.decode(new Buffer('1111你好', 'binary'), 'cp936'),'cp936');
       // socket.write( new Buffer('safj上课打飞机', 'binary').,'cp936');
    })
    socket.on('end',function () {
        console.log("socket断开")
    })
    socket.write('1122欢迎光临')
})

server.listen(8124,function () {
    console.log('server bound')
})


/*var server = net.createServer();
server.on('connection',function(socket){
    //
})
server.listen(8124)*/





