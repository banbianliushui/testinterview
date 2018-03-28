/**
 * Created by xiaozhu on 2018/3/18.
 */
var http = require('http');
var parse = require('./parseBody')
var  fs = require('fs');
var path = require('path')
http.createServer(function(req,res){
    /*let data =[];
    req.on('data',function(chunk){
        data.push(chunk);
    })
    req.on('end',function(chunk){

    })*/
    parse(req,res,function(){
        var pathobj=path.parse( req.url);
        if(req.files){
            var rd = Math.random();
            var destination = '../html/201802/uploads/'+rd+'/'

            fs.mkdir(destination, function(err){
                if(err){

                }
                else{
                    if(Object.prototype.toString.call( req.files)=='[object Object]'){
                        var file = req.files.file;
                        fs.readFile(file.path,(err,data) => {
                            if(err)  {
                                res.end();
                                return ;
                            }
                            fs.writeFile( destination+file.name,data, (err) => {
                                if (err) throw err;
                                console.log('The file has been saved!');
                                res.setHeader('Content-Type', 'text/plain; charset=utf-8')
                                res.end("成功")
                            });
                        })

                    }else  if(Object.prototype.toString.call( req.files)=='[object Array]'){
                            var len = req.files.length;
                            var files = req.files;
                            var promisearr =[];
                                for(var i =0 ;i<len;i++){
                                    let file = files[i];
                                    var promis = new Promise((resolve,reject) =>{
                                        fs.readFile(file[1].path,(err,data) => {
                                            if(err)  {
                                                reject(); throw err;
                                            }
                                            fs.writeFile( destination+file[1].name,data, (err) => {
                                                if (err) { reject(); throw err;}

                                                resolve()
                                                console.log('The file has been saved!');
                                            });
                                        })
                                    })
                                    promisearr.push(promis);
                                }
                        Promise.all(promisearr).then(function(values){
                            res.setHeader('Content-Type', 'text/plain; charset=utf-8')
                            res.end("成功")
                        },function(){
                            res.setHeader('Content-Type', 'text/plain; charset=utf-8')
                            res.end("失败")
                        }).catch(function(err){
                            console.log(err)
                        })

                    }
                }
            })



        } else  if(pathobj.ext=='.html'||pathobj.ext=='.js'||pathobj.ext=='.css'){
            fs.readFile(path.resolve(__dirname,"../","./"+req.url),(err,data) => {
                /* if(err) throw err;*/
                if(err)  {
                    //res.setHeader('Content-Type', 'text/html');
                    // res.writeHead(301, {'Location': 'http://itbilu.com/'});
                    res.writeHead(302, {
                        'Location':'/html/404.html' });
                    res.end();
                    return ;
                }

                res.end(data)
            })
        } else{
            res.end()
        }
    })

}).listen(1337);


function mkdirs(dirname, callback) {
    fs.exists(dirname, function (exists) {
        if (exists) {
            callback();
        } else {
            // console.log(path.dirname(dirname));
            mkdirs(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback);
                console.log('在' + path.dirname(dirname) + '目录创建好' + dirname  +'目录');
            });
        }
    });
}
