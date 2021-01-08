# Vue px2rem 解决方案

```sh
npm i -D postcss-plugin-px2rem
```

vue.config.js

```js
module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-plugin-px2rem')({
            rootValue: 20, //换算基数， 默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
            // unitPrecision: 5, //允许REM单位增长到的十进制数字。
            //propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
            // propBlackList: [], //黑名单
            exclude: /(node_module)/, //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)/ 。如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
            // selectorBlackList: [], //要忽略并保留为px的选择器
            // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
            // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
            mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
            minPixelValue: 3, //设置要替换的最小像素值(3px会被转rem)。 默认 0
          }),
        ],
      },
    },
  },
}
```

## vueCLI3 vant rem 解决方案

- 自动按需引入组件

```js
npm i babel-plugin-import -D
// babel-plugin-import 是一款 babel 插件，它会在编译过程中将 import 的写法自动转换为按需引入的方式


//babel.config.js
module.exports = { plugins: [ ['import', { libraryName: 'vant', libraryDirectory: 'es', style: true }, 'vant'] ] };

// 接着你可以在代码中直接引入 Vant 组件
// 通过配置会自动引入样式
import { Button } from 'vant'

//注意： 配置按需加载后不允许全局引入
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant); //Uncaught ReferenceError: Vant is not defined

```

- px 单位转化为 rem

```js

npm install autoprefixer postcss-pxtorem --save-dev
//vue.config.js

const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')
module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 37.5, //对于宽度为750px的设计图，由于rootValue: 37.5为基准，在写css时候设计图上文字大小多少像素就写多少像素即可
            propList: ['*'],
            // 该项仅在使用 Circle 组件时需要
            // 原因参见 https://github.com/youzan/vant/issues/1948
            selectorBlackList: ['van-circle__layer']
          })
        ]
      }
    }
  }

```

- rem 适配

```js

　//安装

　npm i -S amfe-flexible

　//main.js引入

  import 'amfe-flexible'

```

### PC 适配方案

> pc 不适合 rem 方案，可选择自适应布局
