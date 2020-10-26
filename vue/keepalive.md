# keep alive

keep-alive 是 Vue 提供的一个抽象组件，用来对组件进行缓存，从而节省性能，由于是一个抽象组件，所以在 v 页面渲染完毕后不会被渲染成一个 DOM 元素

```html
<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```
