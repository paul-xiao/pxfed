# ES6

## promise

### 语法
```js

new Promise( function(resolve, reject) {...} /* executor */  );

```
### 描述

三种状态：
- pending: 初始状态，既不是成功，也不是失败状态。
- fulfilled: 意味着操作成功完成。
- rejected: 意味着操作失败。

Promise.prototype.then 和  Promise.prototype.catch 方法返回promise 对象，可支持链式调用

### 方法
- 


### 实现原理

[Promise/A+规范](https://promisesaplus.com/)

```js
class Promise{
    constructor(){

    }

}




```