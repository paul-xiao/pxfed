# ES6

## Promise

### 语法

```js

new Promise( function(resolve, reject) {...} /* executor */  );

```

### 描述

三种状态：

- pending: 初始状态，既不是成功，也不是失败状态。
- fulfilled: 意味着操作成功完成。
- rejected: 意味着操作失败。

Promise.prototype.then 和 Promise.prototype.catch 方法返回 promise 对象，可支持链式调用

### 实现原理

[Promise/A+规范](https://promisesaplus.com/)

1. 术语

- promise：an object or function with a then method
- thenable： an object or function that defines a then method.
- value： promise resolve value, including undefined, a thenable, or a promise
- exception： a value that is thrown using the throw statement.
- reason: promise reject reason

2. 需求

状态

- pending 必须转换成 fulfilled 或者 rejected 状态
- fulfilled 不能改变为任何其他状态，且必须返回一个 value
- rejected 不能改变为任何其他状态，且必须返回一个 reason

then

> Promise 必须提供一个 then 方法来处理 value 或者 rason,then 方法包含两个参数：promise.then(onFulfilled, onRejected)

- onFulfilled, onRejected 为可选参数，如果不是 function,必须忽略
- 如果 onFulfilled 为 function， 必须在 promise 状态为 fulfilled 后调用，且以 value 为第一个参数，必须调用不止一次
- 如果 onRejected 为 function， 必须在 promise 状态为 rejected 后调用，且以 rason 为第一个参数，必须调用不止一次
- onFulfilled or onRejected must not be called until the execution context stack contains only platform code. --- promise 必须为异步，可使用 setTimeout 来实现
- onFulfilled 和 onRejected 必须作为 function 调用（既没有 this 值）
- then 可以被调用多次，存储 resolve 和 reject 队列，在调用 resolve 和 reject 方法时，需要将队列中存放的回调按照先后顺序依次调用
- then 必须返回一个 promise: promise2 = promise1.then(onFulfilled, onRejected);
  - 如果有一个 onFulfilled 或 onRejected 返回一个值 x，请运行 Promise Resolution Procedure [[Resolve]](promise2, x)。
  - 如果任何一个 onFulfilled 或 onRejected 引发异常 e，则 promise2 必须 e 以其为理由予以拒绝。
  - 如果 onFulfilled 不是 function 且 promise1 已 fulfilled，则 promise2 必须使用与相同的值来实现 promise1。
  - 如果 onRejected 不是 function 而 promise1 被 rejected，则 promise2 必须以与相同的理由将其拒绝 promise1。

Promise Resolution Procedure

> resolvePromise(promise2, x, resolve, reject)

- 如果 promise2 和 x 相等，那么 reject promise with a TypeError
- 如果 x 是一个 promsie
  - 如果 x 是 pending 态，那么 promise 必须要在 pending,直到 x 变成 fulfilled or rejected.
  - 如果 x 被 fulfilled, fulfill promise with the same value.
  - 如果 x 被 rejected, reject promise with the same reason.
- 如果 x 是一个 object 或者 是一个 function
  - let then = x.then.
  - 如果 x.then 这步出错，那么 reject promise with e as the reason..
  - 如果 then 是一个函数，then.call(x, resolvePromiseFn, rejectPromise)
    - resolvePromiseFn 的 入参是 y, 执行 resolvePromise(promise2, y, resolve, reject);
    - rejectPromise 的 入参是 r, reject promise with r.
    - 如果 resolvePromise 和 rejectPromise 都调用了，那么第一个调用优先，后面的调用忽略。
    - 如果调用 then 抛出异常 e
      - 如果 resolvePromise 或 rejectPromise 已经被调用，那么忽略
      - 否则，reject promise with e as the reason
  - 如果 then 不是一个 function. fulfill promise with x.
- 如果 x 不是一个 object 或者 function，fulfill promise with x.

源码

```js
//test.js
class MyPromise {
  constructor(exector) {
    this.state = 'pending' //pending, fulfilled, or rejected.
    this.value = undefined
    this.reason = undefined //

    this.onFulfilledCallback = []
    this.onRejectedCallback = []
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
    this.init(exector) // fn
  }

  init(exector) {
    if (typeof exector !== 'function') {
      console.error('resolver must be a funciton')
      return
    }
    try {
      exector(this.resolve, this.reject)
    } catch (err) {
      this.reject(err)
    }
  }
  resolve(value) {
    if (this.state === 'pending') {
      setTimeout(() => {
        //改变执行顺序
        this.state = 'fulfilled'
        this.value = value
        this.onFulfilledCallback.forEach((cb) => cb(this.value))
      })
    }
  }
  reject(reason) {
    if (this.state === 'pending') {
      setTimeout(() => {
        this.state = 'rejected'
        this.reason = reason
        this.onRejectedCallback.forEach((cb) => cb(this.reason))
      })
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (value) => value
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason
          }
    let p2
    if (this.state === 'fulfilled') {
      return (p2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            MyPromise.resolvePromise(p2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }))
    }
    if (this.state === 'rejected') {
      return (p2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            MyPromise.resolvePromise(p2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }))
    }
    if (this.state === 'pending') {
      return (p2 = new MyPromise((resolve, reject) => {
        // 向对了中装入 onFulfilled 和 onRejected 函数
        this.onFulfilledCallback.push((value) => {
          try {
            const x = onFulfilled(value)
            MyPromise.resolvePromise(p2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })

        this.onRejectedCallback.push((reason) => {
          try {
            const x = onRejected(reason)
            MyPromise.resolvePromise(p2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
        // console.log(this.onFulfilledCallback);
        // console.log(this.onRejectedCallback);
      }))
    }
  }

  static resolvePromise(p2, x, resolve, reject) {
    let called = false
    /**
     * 2.3.1 If promise and x refer to the same object, reject promise with a TypeError as the reason.
     */
    if (p2 === x) {
      return reject(
        new TypeError(
          'cannot return the same promise object from onfulfilled or on rejected callback.'
        )
      )
    }

    if (x instanceof MyPromise) {
      // 处理返回值是 Promise 对象的情况
      /**
       * new MyPromise(resolve => {
       *  resolve("Success")
       * }).then(data => {
       *  return new MyPromise(resolve => {
       *    resolve("Success2")
       *  })
       * })
       */
      if (x.status === MyPromise.PENDING) {
        /**
         * 2.3.2.1 If x is pending, promise must remain pending until x is fulfilled or rejected.
         */
        x.then(
          (y) => {
            // 用 x 的 fulfilled 后的 value 值 y，去设置 p2 的状态
            // 上面的注视，展示了返回 Promise 对象的情况，这里调用 then 方法的原因
            // 就是通过参数 y 或者 reason，获取到 x 中的 value/reason

            // 拿到 y 的值后，使用 y 的值来改变 p2 的状态
            // 依照上例，上面生成的 Promise 对象，其 value 应该是 Success2

            // 这个 y 值，也有可能是新的 Promise，因此要递归的进行解析，例如下面这种情况

            /**
             * new Promise(resolve => {
             *  resolve("Success")
             * }).then(data => {
             *  return new Promise(resolve => {
             *    resolve(new Promise(resolve => {
             *      resolve("Success3")
             *    }))
             *  })
             * }).then(data => console.log(data))
             */

            MyPromise.resolvePromise(p2, y, resolve, reject)
          },
          (reason) => {
            reject(reason)
          }
        )
      } else {
        /**
         * 2.3 If x is a thenable, it attempts to make promise adopt the state of x,
         * under the assumption that x behaves at least somewhat like a promise.
         *
         * 2.3.2 If x is a promise, adopt its state [3.4]:
         * 2.3.2.2 If/when x is fulfilled, fulfill promise with the same value.
         * 2.3.2.4 If/when x is rejected, reject promise with the same reason.
         */
        x.then(resolve, reject)
      }
      /**
       * 2.3.3 Otherwise, if x is an object or function,
       */
    } else if (
      (x !== null && typeof x === 'object') ||
      typeof x === 'function'
    ) {
      /**
       * 2.3.3.1 Let then be x.then.
       * 2.3.3.2 If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
       */
      try {
        // then 方法可能设置了访问限制（setter），因此这里进行了错误捕获处理
        const then = x.then
        if (typeof then === 'function') {
          /**
           * 2.3.3.2 If retrieving the property x.then results in a thrown exception e,
           * reject promise with e as the reason.
           */

          /**
           * 2.3.3.3.1 If/when resolvePromise is called with a value y, run [[Resolve]](promise, y).
           * 2.3.3.3.2 If/when rejectPromise is called with a reason r, reject promise with r.
           */

          then.call(
            x,
            (y) => {
              /**
               * If both resolvePromise and rejectPromise are called,
               * or multiple calls to the same argument are made,
               * the first call takes precedence, and any further calls are ignored.
               */
              if (called) return
              called = true
              MyPromise.resolvePromise(p2, y, resolve, reject)
            },
            (r) => {
              if (called) return
              called = true
              reject(r)
            }
          )
        } else {
          resolve(x)
        }
      } catch (e) {
        /**
         * 2.3.3.3.4 If calling then throws an exception e,
         * 2.3.3.3.4.1 If resolvePromise or rejectPromise have been called, ignore it.
         * 2.3.3.3.4.2 Otherwise, reject promise with e as the reason.
         */

        if (called) return
        called = true
        reject(e)
      }
    } else {
      // If x is not an object or function, fulfill promise with x.
      resolve(x)
    }
  }

  catch(rejectFn) {
    return this.then(null, rejectFn)
  }
}
```

验证是否符合 Promise A+规范

> [测试](https://github.com/promises-aplus/promises-tests)

将如下代码加入 MyPromise(test.js)

```js
// tests
MyPromise.deferred = function () {
  const defer = {}
  defer.promise = new MyPromise((resolve, reject) => {
    defer.resolve = resolve
    defer.reject = reject
  })
  return defer
}

try {
  module.exports = MyPromise
} catch (e) {}
```

修改 package.json

```json
"scripts": {
    "test": "promises-aplus-tests ./test.js"
  },
```

```sh
 #promises-aplus-tests
 npm i -D promises-aplus-tests
 # test
 npm run test

```

## Class

```js
Class Dog{
    constructor(){
       this.name='puppy'
    }
}

const dog = new Dog()
console.log(dog.name)
```

### extends

> extends 关键字用来创建一个普通类或者内建对象的子类。

```js
class Square extends Polygon {
  constructor(length) {
    // Here, it calls the parent class' constructor with lengths
    // provided for the Polygon's width and height
    super(length, length)
    // Note: In derived classes, super() must be called before you
    // can use 'this'. Leaving this out will cause a reference error.
    this.name = 'Square'
  }

  get area() {
    return this.height * this.width
  }
}
```

### static

> 类（class）通过 static 关键字定义静态方法。不能在类的实例上调用静态方法，而应该通过类本身调用。这些通常是实用程序方法，例如创建或克隆对象的功能。

```js
class ClassWithStaticMethod {
  static staticProperty = 'someValue'
  static staticMethod() {
    return 'static method has been called.'
  }
}

console.log(ClassWithStaticMethod.staticProperty)
// output: "someValue"
console.log(ClassWithStaticMethod.staticMethod())
// output: "static method has been called."
```

调用静态方法

1.静态方法调用同一个类中的其他静态方法，可使用 this 关键字。

```js
class StaticMethodCall {
  static staticMethod() {
    return 'Static method has been called'
  }
  static anotherStaticMethod() {
    return this.staticMethod() + ' from another static method'
  }
}
StaticMethodCall.staticMethod()
// 'Static method has been called'

StaticMethodCall.anotherStaticMethod()
// 'Static method has been called from another static method'
```

2.非静态方法中，不能直接使用 this 关键字来访问静态方法。而是要用类名来调用：CLASSNAME.STATIC_METHOD_NAME() ，或者用构造函数的属性来调用该方法： this.constructor.STATIC_METHOD_NAME().

```js
class StaticMethodCall {
  constructor() {
    console.log(StaticMethodCall.staticMethod())
    // 'static method has been called.'
    console.log(this.constructor.staticMethod())
    // 'static method has been called.'
  }
  static staticMethod() {
    return 'static method has been called.'
  }
}
```

## 对象数组去重

```js
const tmp = {}
const result = arr.reduce((item, next) => {
  tmp[next.key] ? '' : (tmp[next.key] = true && item.push(next))
  return item
}, [])
```

## Proxy

> https://segmentfault.com/a/1190000019198822

基础用法

```js
let target = {
  name: 'Tom',
  age: 24,
}
let handler = {
  get: function (target, key) {
    console.log('getting ' + key)
    return target[key] // 不是target.key
  },
  set: function (target, key, value) {
    console.log('setting ' + key)
    target[key] = value
  },
}
let proxy = new Proxy(target, handler)
proxy.name // 实际执行 handler.get
proxy.age = 25 // 实际执行 handler.set
// getting name
// setting age
// 25
```

handler 对象方法

> handler 对象是一个容纳一批特定属性的占位符对象。它包含有 Proxy 的各个捕获器（trap）。所有的捕捉器是可选的。如果没有定义某个捕捉器，那么就会保留源对象的默认行为。

```js
handler.getPrototypeOf()
//Object.getPrototypeOf 方法的捕捉器。
handler.setPrototypeOf()
//Object.setPrototypeOf 方法的捕捉器。
handler.isExtensible()
//Object.isExtensible 方法的捕捉器。
handler.preventExtensions()
//Object.preventExtensions 方法的捕捉器。
handler.getOwnPropertyDescriptor()
//Object.getOwnPropertyDescriptor 方法的捕捉器。
handler.defineProperty()
//Object.defineProperty 方法的捕捉器。
handler.has()
//in 操作符的捕捉器。
handler.get()
//属性读取操作的捕捉器。
handler.set()
//属性设置操作的捕捉器。
handler.deleteProperty()
//delete 操作符的捕捉器。
handler.ownKeys()
//Object.getOwnPropertyNames 方法和 Object.getOwnPropertySymbols 方法的捕捉器。
handler.apply()
//函数调用操作的捕捉器。
handler.construct()
//new 操作符的捕捉器。
```

[与 Object.defineProperty 的区别](https://segmentfault.com/a/1190000019198822)

- 支持数组
- 针对整个对象
- 嵌套

[应用场景](https://segmentfault.com/a/1190000006035363)

- 数据校验
- 私有属性
- 访问日志
- 预计拦截
- 过滤操作
- 中断代理

## Reflect

> 与大多数全局对象不同 Reflect 并非一个构造函数，所以不能通过 new 运算符对其进行调用，或者将 Reflect 对象作为一个函数来调用。Reflect 的所有属性和方法都是静态的（就像 Math 对象）。

静态方法

```js
Reflect.apply(target, thisArgument, argumentsList)
//对一个函数进行调用操作，同时可以传入一个数组作为调用参数。和 Function.prototype.apply() 功能类似。
Reflect.construct(target, argumentsList[, newTarget])
// 对构造函数进行 new 操作，相当于执行 new target(...args)。
Reflect.defineProperty(target, propertyKey, attributes)
// 和 Object.defineProperty() 类似。如果设置成功就会返回 true
Reflect.deleteProperty(target, propertyKey)
// 作为函数的delete操作符，相当于执行 delete target[name]。
Reflect.get(target, propertyKey[, receiver])
// 获取对象身上某个属性的值，类似于 target[name]。
Reflect.getOwnPropertyDescriptor(target, propertyKey)
// 类似于 Object.getOwnPropertyDescriptor()。如果对象中存在该属性，则返回对应的属性描述符,  否则返回 undefined.
Reflect.getPrototypeOf(target)
// 类似于 Object.getPrototypeOf()。
Reflect.has(target, propertyKey)
// 判断一个对象是否存在某个属性，和 in 运算符 的功能完全相同。
Reflect.isExtensible(target)
// 类似于 Object.isExtensible().
Reflect.ownKeys(target)
// 返回一个包含所有自身属性（不包含继承属性）的数组。(类似于 Object.keys(), 但不会受enumerable影响).
Reflect.preventExtensions(target)
// 类似于 Object.preventExtensions()。返回一个Boolean。
Reflect.set(target, propertyKey, value[, receiver])
// 将值分配给属性的函数。返回一个Boolean，如果更新成功，则返回true。
Reflect.setPrototypeOf(target, prototype)
// 设置对象原型的函数. 返回一个 Boolean， 如果更新成功，则返回true。
```

示例

```js
// 检测一个对象是否存在特定属性
const duck = {
  name: 'Maurice',
  color: 'white',
  greeting: function () {
    console.log(`Quaaaack! My name is ${this.name}`)
  },
}

Reflect.has(duck, 'color')
// true
Reflect.has(duck, 'haircut')
// false
// 返回这个对象自身的属性
Reflect.ownKeys(duck)
// [ "name", "color", "greeting" ]
// 为这个对象添加一个新的属性
Reflect.set(duck, 'eyes', 'black')
// returns "true" if successful
// "duck" now contains the property "eyes: 'black'"
```
