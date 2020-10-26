# 响应式原理

## 如何追踪变化

在生成 vue 实例时，为对传入的 data 进行遍历，使用 Object.defineProperty 把这些属性转为 getter/setter.

Object.defineProperty 是 ES5 中一个无法 shim 的特性，这也就是 Vue 不支持 IE8 以及更低版本浏览器的原因。

这些 getter/setter 对用户来说是不可见的，但是在内部它们让 Vue 能够追踪依赖，在 property 被访问和修改时通知变更。

每个组件实例都对应一个 watcher 实例，它会在组件渲染的过程中把“接触”过的数据 property 记录为依赖。之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。
![image](/reactive.png)

## 检测数组和对象的变化

由于 JavaScript 的限制，Vue 不能检测数组和对象的变化，尽管如此还是有一些办法来回避这些限制并保证它们的响应性。

1. 对象
   Vue 无法检测 property 的添加或移除。由于 Vue 会在初始化实例时对 property 执行 getter/setter 转化，所以 property 必须在 data 对象上存在才能让 Vue 将它转换为响应式的

```js
var vm = new Vue({
  data: {
    a: 1,
    someObject: {},
  },
})

// `vm.a` 是响应式的

vm.b = 2
// `vm.b` 是非响应式的

//对于已经创建的实例，Vue 不允许动态添加根级别的响应式 property。但是，可以使用 Vue.set(object, propertyName, value) 方法向嵌套对象添加响应式 property
Vue.set(vm.someObject, 'b', 2)
//alias
this.$set(this.someObject, 'b', 2)
//赋值多个新 property
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
```

2. 数组

Vue 不能检测以下数组的变动：

当你利用索引直接设置一个数组项时，例如：vm.items[indexOfItem] = newValue

当你修改数组的长度时，例如：vm.items.length = newLength

```js
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c'],
  },
})
vm.items[1] = 'x' // 不是响应性的
vm.items.length = 2 // 不是响应性的

//为了解决第一类问题，以下两种方式都可以实现和 vm.items[indexOfItem] = newValue 相同的效果，同时也将在响应式系统内触发状态更新：

// Vue.set
Vue.set(vm.items, indexOfItem, newValue)
// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
// 你也可以使用 vm.$set 实例方法，该方法是全局方法 Vue.set 的一个别名：

vm.$set(vm.items, indexOfItem, newValue)
// 为了解决第二类问题，你可以使用 splice：

vm.items.splice(newLength)
```

## 声明响应式属性

由于 Vue 不允许动态添加根级响应式属性，所以你必须在初始化实例前声明所有根级响应式属性，哪怕只是一个空值。

```js
var vm = new Vue({
  data: {
    // 声明 message 为一个空值字符串
    message: '',
  },
  template: '<div>{{ message }}</div>',
})
// 之后设置 `message`
vm.message = 'Hello!'
```

如果你未在 data 选项中声明 message，Vue 将警告你渲染函数正在试图访问不存在的属性

## 异步更新队列

> 可能你还没有注意到，Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。[more](https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97)

```html
<div id="example">{{message}}</div>
//html
```

```js
var vm = new Vue({
  el: '#example',
  data: {
    message: '123',
  },
})
vm.message = 'new message' // 更改数据
vm.$el.textContent === 'new message' // false
Vue.nextTick(function () {
  //在组件内使用 vm.$nextTick() 实例方法特别方便，因为它不需要全局 Vue，并且回调函数中的 this 将自动绑定到当前的 Vue 实例上
  this.$el.textContent === 'new message' // true
})
```

因为 \$nextTick() 返回一个 Promise 对象，所以你可以使用新的 ES2017 async/await 语法完成相同的事情：

```js
methods: {
  updateMessage: async function () {
    this.message = '已更新'
    console.log(this.$el.textContent) // => '未更新'
    await this.$nextTick()
    console.log(this.$el.textContent) // => '已更新'
  }
}
```
