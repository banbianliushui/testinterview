
/**
 * Created by xiaozhu on 2018/3/7.
 */
/*http://blog.csdn.net/uniquelike/article/details/52574476*/
/*https://github.com/websockets/ws*/
/*https://github.com/websockets/ws/blob/master/doc/ws.md*/
const webSocket = require('ws');
const wss = new webSocket.Server({port:3000});

//广播到所有人
wss.broadcast = function broadcast(tag,ws){
    wss.clients.forEach(function each(client){
        if(client.readyState == webSocket.OPEN ){
            if(tag == 1){
                client.send(ws.name+" : "+ws.msg)
            }else if(tag == 0){
                client.send(ws+'退出聊天室');
            }


        }
    })
}

//
wss.on('connection',function connection(ws){
    ws.send("您是第"+wss.clients.size+"位");
    ws.on('message',function incoming(message,flags){
        console.log('received:%s',message);
        var user = JSON.parse(message);
        this.user = user;



           if(user.msg!=undefined){
               wss.broadcast(1,user)
           }
          /*  if(client != ws && client.readyState === webSocket.OPEN){
                client.send(message);
            }*/


    });

    ws.on('close',function(close){
        try{
            wss.broadcast('0',this.user.name);
        }catch(e){
            console.log('刷新页面了')
        }
    })
})


