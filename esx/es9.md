

## 异步迭代
```js

async function process(array) {
  for await (let i of array) {
    doSomething(i);
  }
}


```