# redis

## pub/sub

发布（publish）/ 订阅（subscribe）

## Hmset

Redis Hmset 命令用于同时将多个 field-value (字段-值)对设置到哈希表中。

```js
//  key
//    1) foo   => bar
//    2) hello => world
client.HMSET('key', 'foo', 'bar', 'hello', 'world')
```
