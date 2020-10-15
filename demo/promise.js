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


// let p = new MyPromise((resolve) => { resolve('111') })
// let d = (val) => new MyPromise((resolve) => { resolve(val + '111') })
// p.then(val => d(val)).then(e => {
//     console.log(2222, e)
//     return new MyPromise((resolve, reject) => reject(e + 333))
// }).catch(e => console.log(e))