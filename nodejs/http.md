# http

## createServer

```js


var http = require("http")
http.createServer(function(req,res){//回调函数
    console.log(req.httpVersion);
    console.log(req.headers);
    console.log(req.method);
    console.log(req.url);
    console.log(req.trailers);
    console.log(req.complete);
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write("hola")
res.end("hola");


```

与 express listen 的区别

两种实现效果相同
通过 http 创建，可以在 express 基础上使用更多 http 功能
通过 http 创建，更便于扩展至 https 服务器

```js
express: var express = require('express')
var app = express()

//app.configure, app.use etc

app.listen(80)

http: var express = require('express'),
  http = require('http')
var app = express()
var server = http.createServer(app)

//app.configure, app.use etc

server.listen(80)
```
