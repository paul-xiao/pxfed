# 自定义组件 v-model

> 允许一个自定义组件在使用 v-model 时定制 prop 和 event。默认情况下，一个组件上的 v-model 会把 value 用作 prop 且把 input 用作 event，但是一些输入类型比如单选框和复选框按钮可能想使用 value prop 来达到不同的目的。使用 model 选项可以回避这些情况产生的冲突。

```vue
<!-- parent -->
<template>
  <div class="parent">
    <p>我是父亲, 对儿子说： {{ sthGiveChild }}</p>
    <button @click="changeChild">xxxx</button>

    <child v-model="sthGiveChild"></child>
  </div>
</template>
<script>
import child from './child.vue'
export default {
  data() {
    return {
      sthGiveChild: '给你100块',
    }
  },
  components: {
    child,
  },
  methods: {
    changeChild() {
      this.changeChild = '给你1000块'
    },
  },
}
</script>
```

## 普通情况

```vue
<!-- child -->
<template>
  <div class="child">
    <p>我是儿子，父亲对我说： {{ value }}</p>
    <a href="javascript:;" rel="external nofollow" @click="returnBackFn"
      >回应</a
    >
  </div>
</template>
<script>
export default {
  name: 'Child',
  props: {
    value: String,
  },

  methods: {
    returnBackFn() {
      this.$emit('input', '还你200块')
    },
  },
}
</script>
```

## 特殊情况

> 像单选框、复选框等类型的输入控件可能会将 value attribute 用于不同的目的。使用 model 选项可以回避这些情况产生的冲突。(改成 value|input 效果一样)

```vue
<!-- child -->
<template>
  <div class="child">
    <p>我是儿子，父亲对我说： {{ give }}</p>
    <a href="javascript:;" rel="external nofollow" @click="returnBackFn"
      >回应</a
    >
  </div>
</template>
<script>
export default {
  name: 'Child',
  props: {
    give: String,
  },
  model: {
    prop: 'give',
    event: 'returnBack',
  },
  methods: {
    returnBackFn() {
      this.$emit('returnBack', '还你200块')
    },
  },
}
</script>
```
