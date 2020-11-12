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
Person.prototype.sayName = function () {
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

  this.privilegedMethod = function () {
    // it can access private members
    //..
  }
}

// A 'static method', it's just like a normal function
// it has no relation with any 'MyClass' object instance
MyClass.staticMethod = function () {}

MyClass.prototype.publicMethod = function () {
  // the 'this' keyword refers to the object instance
  // you can access only 'privileged' and 'public' members
}

var myObj = new MyClass() // new object instance

myObj.publicMethod()
MyClass.staticMethod()
```

## refs

1. [图解 JS 原型和原型链实现原理](https://www.jb51.net/article/195651.htm)
2. [javascript-class-method-vs-class-prototype-method](https://stackoverflow.com/questions/1635116/javascript-class-method-vs-class-prototype-method)
