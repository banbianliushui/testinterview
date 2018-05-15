/*https://xhr.spec.whatwg.org/#handler-xhr-onreadystatechange*/
/*https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Server-Side_Access_Control*/
var http = require('http')
const proxy = http.createServer((req,res) =>{
    res.writeHead(200,{
        'Content-Type':'text/plain',
        'Access-Control-Allow-Origin':'http://localhost:63342',/*如果xhr.withCredentials设置了这里不能用**/
        'Access-Control-Allow-Credentials':true/*与 xhr.withCredentials对应*/,
        'Access-Control-Allow-Headers':'Content-Type,X-PATH'/*options请求headers需加上*//*,
        'Access-Control-Request-Methods':''*/
    });
    res.end('xx');
});
proxy.listen(1337,()=>{
    console.log('start')
})
proxy.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.log('Address in use, retrying...');
        setTimeout(() => {
            proxy.close();
            proxy.listen(1337);
        }, 1000);
    }
});