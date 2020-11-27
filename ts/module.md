# 模块

## import...from import...require 的区别

```js

// commonjs
module.exports = {
    ...
}

import * as xx from 'xx';

//es6
export default ...
import xx from 'xx';

// commonjs declare export = xx

declare function xx():void;
export = xx
import xx = require('xx')

// 没有类型声明 默认导入any类型
const xx = require('xx')


```
