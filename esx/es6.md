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

Promise.prototype.then 和  Promise.prototype.catch 方法返回promise 对象，可支持链式调用

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
   - pending 必须转换成fulfilled或者rejected状态
   - fulfilled 不能改变为任何其他状态，且必须返回一个value
   - rejected 不能改变为任何其他状态，且必须返回一个reason

 then 

 > Promise 必须提供一个then方法来处理value或者rason,then方法包含两个参数：promise.then(onFulfilled, onRejected)

   - onFulfilled, onRejected 为可选参数，如果不是function,必须忽略
   - 如果onFulfilled为function， 必须在promise状态为fulfilled后调用，且以value为第一个参数，必须调用不止一次
   - 如果onRejected为function， 必须在promise状态为rejected后调用，且以rason为第一个参数，必须调用不止一次
   - onFulfilled or onRejected must not be called until the execution context stack contains only platform code. --- promise必须为异步，可使用setTimeout来实现
   - onFulfilled 和 onRejected 必须作为function调用（既没有this值）
   - then可以被调用多次，存储resolve 和 reject队列，在调用 resolve 和 reject 方法时，需要将队列中存放的回调按照先后顺序依次调用
   - then必须返回一个promise: promise2 = promise1.then(onFulfilled, onRejected);
     - 如果有一个onFulfilled或onRejected返回一个值x，请运行Promise Resolution Procedure [[Resolve]](promise2, x)。
     - 如果任何一个onFulfilled或onRejected引发异常e，则promise2必须e以其为理由予以拒绝。
     - 如果onFulfilled不是function且promise1已fulfilled，则promise2必须使用与相同的值来实现promise1。
     - 如果onRejected不是function而promise1被rejected，则promise2必须以与相同的理由将其拒绝promise1。

Promise Resolution Procedure
> resolvePromise(promise2, x, resolve, reject)
- 如果 promise2 和 x 相等，那么 reject promise with a TypeError
- 如果 x 是一个 promsie
  - 如果x是pending态，那么promise必须要在pending,直到 x 变成 fulfilled or rejected.
  - 如果 x 被 fulfilled, fulfill promise with the same value.
  - 如果 x 被 rejected, reject promise with the same reason.
- 如果 x 是一个 object 或者 是一个 function
  - let then = x.then.
  - 如果 x.then 这步出错，那么 reject promise with e as the reason..
  - 如果 then 是一个函数，then.call(x, resolvePromiseFn, rejectPromise)
    -  resolvePromiseFn 的 入参是 y, 执行 resolvePromise(promise2, y, resolve, reject);
    -  rejectPromise 的 入参是 r, reject promise with r.
    -  如果 resolvePromise 和 rejectPromise 都调用了，那么第一个调用优先，后面的调用忽略。
    -  如果调用then抛出异常e 
       - 如果 resolvePromise 或 rejectPromise 已经被调用，那么忽略
       - 否则，reject promise with e as the reason
  - 如果 then 不是一个function. fulfill promise with x.
- 如果 x 不是一个 object 或者 function，fulfill promise with x.


源码
```js
//test.js
class MyPromise {
    constructor(exector) {

        this.state = 'pending' //pending, fulfilled, or rejected.
        this.value = undefined
        this.reason = undefined //

        this.onFulfilledCallback = [];
        this.onRejectedCallback = [];
        this.resolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this);
        this.init(exector)// fn

    }


    init(exector) {
        if (typeof exector !== 'function') {
            console.error('resolver must be a funciton')
            return;
        }
        try {
            exector(this.resolve, this.reject);
        } catch (err) {
            this.reject(err);
        }
    }
    resolve(value) {

        if (this.state === 'pending') {
            setTimeout(() => {   //改变执行顺序
                this.state = 'fulfilled';
                this.value = value;
                this.onFulfilledCallback.forEach(cb => cb(this.value))
            })

        }
    }
    reject(reason) {
        if (this.state === 'pending') {
            setTimeout(() => {
                this.state = 'rejected';
                this.reason = reason;
                this.onRejectedCallback.forEach(cb => cb(this.reason))
            })

        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value
        onRejected = typeof onRejected === "function" ? onRejected : reason => { throw reason }
        let p2
        if (this.state === 'fulfilled') {
            return p2 = new MyPromise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        const x = onFulfilled(this.value);
                        MyPromise.resolvePromise(p2, x, resolve, reject);
                    } catch (error) {
                        reject(error)
                    }
                })
            })
        }
        if (this.state === 'rejected') {
            return p2 = new MyPromise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        const x = onRejected(this.reason)
                        MyPromise.resolvePromise(p2, x, resolve, reject);
                    } catch (error) {
                        reject(error)
                    }
                })
            })
        }
        if (this.state === 'pending') {
            return p2 = new MyPromise((resolve, reject) => {
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
            })
        }


    }

    static resolvePromise(p2, x, resolve, reject) {
        let called = false;
        /**
         * 2.3.1 If promise and x refer to the same object, reject promise with a TypeError as the reason.
         */
        if (p2 === x) {
            return reject(new TypeError("cannot return the same promise object from onfulfilled or on rejected callback."))
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
                x.then(y => {
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
                }, reason => {
                    reject(reason)
                })
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
        } else if ((x !== null && typeof x === "object") || typeof x === "function") {
            /**
             * 2.3.3.1 Let then be x.then. 
             * 2.3.3.2 If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
             */
            try {
                // then 方法可能设置了访问限制（setter），因此这里进行了错误捕获处理
                const then = x.then;
                if (typeof then === "function") {

                    /**
                     * 2.3.3.2 If retrieving the property x.then results in a thrown exception e, 
                     * reject promise with e as the reason.
                     */

                    /**
                     * 2.3.3.3.1 If/when resolvePromise is called with a value y, run [[Resolve]](promise, y).
                     * 2.3.3.3.2 If/when rejectPromise is called with a reason r, reject promise with r.
                     */

                    then.call(x, y => {
                        /**
                         * If both resolvePromise and rejectPromise are called, 
                         * or multiple calls to the same argument are made, 
                         * the first call takes precedence, and any further calls are ignored.
                         */
                        if (called) return;
                        called = true;
                        MyPromise.resolvePromise(p2, y, resolve, reject)
                    }, r => {
                        if (called) return;
                        called = true;
                        reject(r);
                    })
                } else {
                    resolve(x)
                }
            } catch (e) {
                /**
                 * 2.3.3.3.4 If calling then throws an exception e,
                 * 2.3.3.3.4.1 If resolvePromise or rejectPromise have been called, ignore it.
                 * 2.3.3.3.4.2 Otherwise, reject promise with e as the reason.
                 */

                if (called) return;
                called = true;
                reject(e)
            }
        } else {
            // If x is not an object or function, fulfill promise with x.
            resolve(x);
        }
    }

    catch(rejectFn) {
        return this.then(null, rejectFn)
    }
}

```
验证是否符合Promise A+规范

> [测试](https://github.com/promises-aplus/promises-tests) 

将如下代码加入MyPromise(test.js)

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
} catch (e) {
}

```

修改package.json

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
> extends关键字用来创建一个普通类或者内建对象的子类。

```js
class Square extends Polygon {
  constructor(length) {
    // Here, it calls the parent class' constructor with lengths
    // provided for the Polygon's width and height
    super(length, length);
    // Note: In derived classes, super() must be called before you
    // can use 'this'. Leaving this out will cause a reference error.
    this.name = 'Square';
  }

  get area() {
    return this.height * this.width;
  }
}

```

### static
> 类（class）通过 static 关键字定义静态方法。不能在类的实例上调用静态方法，而应该通过类本身调用。这些通常是实用程序方法，例如创建或克隆对象的功能。

```js

class ClassWithStaticMethod {

  static staticProperty = 'someValue';
  static staticMethod() {
    return 'static method has been called.';
  }

}

console.log(ClassWithStaticMethod.staticProperty);
// output: "someValue"
console.log(ClassWithStaticMethod.staticMethod());
// output: "static method has been called."

```
调用静态方法

1.静态方法调用同一个类中的其他静态方法，可使用 this 关键字。
```js
class StaticMethodCall {
    static staticMethod() {
        return 'Static method has been called';
    }
    static anotherStaticMethod() {
        return this.staticMethod() + ' from another static method';
    }
}
StaticMethodCall.staticMethod();
// 'Static method has been called'

StaticMethodCall.anotherStaticMethod();
// 'Static method has been called from another static method'
```
2.非静态方法中，不能直接使用 this 关键字来访问静态方法。而是要用类名来调用：CLASSNAME.STATIC_METHOD_NAME() ，或者用构造函数的属性来调用该方法： this.constructor.STATIC_METHOD_NAME().
```js

class StaticMethodCall {
    constructor() {
        console.log(StaticMethodCall.staticMethod());
        // 'static method has been called.'
        console.log(this.constructor.staticMethod());
        // 'static method has been called.'
    }
    static staticMethod() {
        return 'static method has been called.';
    }
}
```

### 对象数组去重

```js

const tmp = {};
const result = arr.reduce((item, next)=>{
    tmp[next.key] ? '' : tmp[next.key] = true && item.push(next);
    return item;
},[])

```