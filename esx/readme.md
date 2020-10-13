# Esx
ECMAScript 各版本骚操作

## 历史
https://en.wikipedia.org/wiki/ECMAScript

ECMAScript version history


|        |	Date published |         Name            |
|  ----  |      ----       |         ----            | 
| 5	     |  Dec 2009       |       ES5               |
| 5.1    | 	June 2011	   |       ES5修订版          |
| 6	     |  June 2015	   | ECMAScript 2015 (ES2015)| 
| 7	     |  June 2016	   | ECMAScript 2016 (ES2016)| 
| 8	     |  June 2017	   | ECMAScript 2017 (ES2017)| 
| 9	     |  June 2018	   | ECMAScript 2018 (ES2018)| 
| 10     | 	June 2019	   | ECMAScript 2019 (ES2019)| 
| 11     | 	June 2020	   | ECMAScript 2020 (ES2020)| 



## 版本特性
![image](/esx.jpeg)


- Es5
  - bind
  - apply
- Es6
  - Promose
  - Generator
- Es7
  - Array.prototype.includes  
  - 指数运算符 
- Es8
  - async await
  - Object.entries()
  - Object.values()
  - padStart()和padEnd()
  - Object.getOwnPropertyDescriptors()
  - 函数参数支持尾部逗号
  - Decorator
- Es9
  - 异步迭代器(asynchronous iterators)
  - Promise.finally()
  - Rest/Spread 属性
  - 正则表达式命名捕获组（Regular Expression Named Capture Groups）
  - 正则表达式反向断言（lookbehind）
  - 正则表达式dotAll模式
  - 正则表达式 Unicode 转义
  - 非转义序列的模板字符串
- [Es10](https://segmentfault.com/a/1190000018311280)
  - bigInt
  - String.prototype.matchAll()
  - 动态导入
  - Array.flat()
  - Array.flatMap()
  - Object.formEntries()
  - String.trimStart | String.trimEnd
  - Function.toString
  - 可选的try/catch错误变量
  - globalThis

## todo
- Es5
    - ES5 实现 new
    - ES5 实现 let/const
    - ES5 实现 call/apply/bind
    - ES5 实现 防抖和节流函数
- 如何实现一个通过 Promise/A+ 规范的 Promise
- 基于 Proxy 实现简易版 Vue

https://juejin.im/post/6854573209329598472
https://juejin.im/post/6844903926295166983#heading-13