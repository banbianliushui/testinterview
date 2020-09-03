let express = require("express");
let http = require("http");
let { createProxyMiddleware } = require("http-proxy-middleware");
let compression = require("compression");
// 单页面配置默认index入口页面， req.url = rewriteTarget 解析配置的默认入口文件，get请求默认返回index.html
let history = require("connect-history-api-fallback");

let app = express();
let httpServer = http.createServer(app);
// app.use(
//   "/test",
//   createProxyMiddleware({
//     //待测试
//     target: "http://purchase.51miaoge.net/purchase/",
//     changeOrigin: true,
//     pathRewrite: {
//       "^/purchase": "",
//     },
//   })
// );

app.use(
  history({
    verbose: true,
    index: "./index.html",
  })
);



// app.use(compression());
 app.use(express.static("./public"));

let PORT = 3333;

httpServer.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("HTTP at http://localhost:" + PORT + "\n");
});
