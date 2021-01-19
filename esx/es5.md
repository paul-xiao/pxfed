# es5

## 实例方法和原型方法的区别

要想让构造函数生成的所有实例对象都能够共享属性，那么我们就给构造函数加一个属性叫做 prototype，用来指向原型对象，我们把所有实例对象共享的属性和方法都放在这个构造函数的 prototype 属性指向的原型对象中，不需要共享的属性和方法放在构造函数中。

```js
function Person(name) {
  this.name = name
  this.sex = '男'
  this.foo = () => {
    //实例方法
    console.log('foo')
  }
}
// 原型方法
Person.prototype.sayName = function() {
  console.log(this.name)
}

let p1 = new Person('tom')
let p2 = new Person('jerry')

console.log(p1.foo === p2.foo) //false
console.log(p1.sayName === p2.sayName) //true

// es6

// constructor function
function MyClass() {
  var privateVariable // private member only available within the constructor fn

  this.privilegedMethod = function() {
    // it can access private members
    //..
  }
}

// A 'static method', it's just like a normal function
// it has no relation with any 'MyClass' object instance
MyClass.staticMethod = function() {}

MyClass.prototype.publicMethod = function() {
  // the 'this' keyword refers to the object instance
  // you can access only 'privileged' and 'public' members
}

var myObj = new MyClass() // new object instance

myObj.publicMethod()
MyClass.staticMethod()
```

## 设计模式

## 跨域

### CORS

> CORS(Cross-Origin Resource sharing, 跨源资源共享)， 基本思想：使用自定义 http 头部让浏览器与服务器进行沟通，从而决定请求或响应是成功还是失败

[浏览器支持](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#browser_compatibility)

```js
// request
Origin: domain
// response
Access-Control-Allow-Oriign: '*'|domain

```

### preflight requests[3]

> A CORS preflight request is a CORS request that checks to see if the CORS protocol is understood and a server is aware using specific methods and headers.

它一般是用了以下几个 HTTP 请求首部的 OPTIONS 请求：Access-Control-Request-Method 和 Access-Control-Request-Headers，以及一个 Origin 首部。

当有必要的时候，浏览器会自动发出一个预检请求；所以在正常情况下，前端开发者不需要自己去发这样的请求。

举个例子，一个客户端可能会在实际发送一个 DELETE 请求之前，先向服务器发起一个预检请求，用于询问是否可以向服务器发起一个 DELETE 请求：

```
OPTIONS /resource/foo
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: origin, x-requested-with
Origin: https://foo.bar.org
```

如果服务器允许，那么服务器就会响应这个预检请求。并且其响应首部 Access-Control-Allow-Methods 会将 DELETE 包含在其中：

```
HTTP/1.1 200 OK
Content-Length: 0
Connection: keep-alive
Access-Control-Allow-Origin: https://foo.bar.org
Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE
Access-Control-Max-Age: 86400
```

### 带凭据的请求[4]

> 带凭据的请求(XMLHttpRequest.withCredentials) 属性是一个 Boolean 类型，它指示了是否该使用类似 cookies,authorization headers(头部授权)或者 TLS 客户端证书这一类资格证书来创建一个跨站点访问控制（cross-site Access-Control）请求。在同一个站点下使用 withCredentials 属性是无效的。

### IE10 以下如何处理跨域

> XDomainRequest 是在 IE8 和 IE9 上的 HTTP access control (CORS) 的实现，在 IE10 中被 包含 CORS 的 XMLHttpRequest 取代了，如果你的开发目标是 IE10 或 IE 的后续版本，或想要支待其他的浏览器，你需要使用标准的 HTTP access control。该接口可以发送 GET 和 POST 请求

### 其他跨域技术

- 图像 ping
  - 常用于跟踪用户点击和动态广告曝光次数
- JSONP
  - 通过<script></script>元素调用回调函数,响应数据传入回调函数
- Comet
  - 服务器向页面推送数据
- 服务器发送事件（SSE）
- Websockts

## 高级函数

> refs

1. [图解 JS 原型和原型链实现原理](https://www.jb51.net/article/195651.htm)
2. [javascript-class-method-vs-class-prototype-method](https://stackoverflow.com/questions/1635116/javascript-class-method-vs-class-prototype-method)
3. [prefilght request](https://developer.mozilla.org/zh-CN/docs/Glossary/Preflight_request)
4. [withCredentials](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/withCredentials)
