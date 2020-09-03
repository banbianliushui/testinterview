var http = require('http');
var fs = require('fs');
var  path = require('path')
http.createServer(function (req, res) {
    if(req.url === '/sendMessage') {
        res.writeHead(200, {
            "Content-Type": "text/event-stream" //设置头信息
        });

        setInterval(function () {
            res.write(
                //事件一
                "data:'事件一-" + new Date().toLocaleTimeString() + "'\n\n" + //必须“\n\n”结尾,事件边界
                //事件二
                ": '这是注释！'" + "\n" +
                "event: myEvent" + "\n" + 
                "data:{name:'事件二-myEvent',time:"+ new Date().toLocaleString()+"}"  + "\n\n"+
                 //事件三
                "event: otherEvent" + "\n" + 
                "data:{name:'事件三-otherEvent-firstdata',time:"+ new Date().toLocaleString()+"8}" + "\n"  +
                "data:{name:'事件三-otherEvent-seconddata',time:"+ new Date().toLocaleString()+"9}"  + "\n\n"
            );
        }, 1000);
    } else {
      let filepath = path.resolve(__dirname,'./eventsource.html')
      console.log('filepath',filepath)
        fs.readFile(filepath, function (err, content) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(content, 'utf-8');
        });
    }

}).listen(3000);