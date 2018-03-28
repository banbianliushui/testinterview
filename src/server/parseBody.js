/**
 * Created by xiaozhu on 2018/3/18.
 */
var formidable = require('formidable');
var crypto = require('crypto');
var querystring = require('querystring');
var hasBody = function(req){
    return 'transfer-encoding' in req.headers || 'content-length' in req.headers;
}

var parseBody = function(req,res,callback){
    if(hasBody(req)){
        var buffers = [];
        req.on('data',function(chunk){
            buffers.push(chunk);
        })
        req.on('end',function(){
            req.rawBody = Buffer.concat(buffers).toString();
            callback(req,res)
        })
    }
}

var parseMultipare = function(req,res,handle){
    if(hasBody(req)){
        if(mime(req) ==='multipart/form-data'){
            var form = new formidable.IncomingForm();
           // form.uploadDir='./temp';//缓存地址
            form.multiples=true;//设置为多文件上传
            form.keepExtensions=true;//是否包含文件后缀
            var filelists=[];
            //文件都将保存在files数组中
            form.on('file', function (filed,file) {
                if(file.size>0){
                    filelists.push([filed,file]);
                }

            })
            form.parse(req,function(err,fields,files){
                    req.body = fields;
                    req.files= filelists.length>1? filelists:filelists[0];
                    /*https://blog.csdn.net/zhang_wang_lina/article/details/52818055*/
                //files.uuu[k]里保存着用户所上传的文件
                handle(req,res);
            })

        }
    }else {handle(req,res)}
}
var mime = function(req){
    var str = req.headers['content-type'] || '';
    return str.split(';')[0];
}

function getFilename (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
        cb(err, err ? undefined : raw.toString('hex'))
    })
}

function parse (req,res,callback){
    if(hasBody(req)){
        if(mime(req) === 'application/x-www-form-urlencoded'){
            parseBody(req,res,function(req,res){
                req.body = querystring.parse(req.rawBody);
                callback(req,res);
            })

        }else if(mime(req) === 'application/json'){

        }else if(mime(req) == 'application/xml'){

        }else if(mime(req) === 'multipart/form-data'){
            parseMultipare(req,res,callback)
        }
    }else{
        callback(req,res)
    }
}
module.exports =parse