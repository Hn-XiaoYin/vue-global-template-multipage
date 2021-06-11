# vue-global-template

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### 集成Vuex模块
```
store
    -moudules Vuex模块
    -types 声明常量作为函数名
    -index 入口文件

1.命名空间使用方式

...mapGetters("login", {
    hasLogin: "hasLogin",
})

2.命名空间使用方式

...mapGetters({
    hasLogin: "login/hasLogin",
    userInfo: "login/userInfo",
})

```

### 配置多环境变量
```

属性名必须以VUE_APP_开头
根据启动命令vue会自动加载对应的环境，vue是根据文件名进行加载的
process.env 全局属性那里都能用
.env 全局默认配置文件，不论什么环境都会加载合并
.env.development 开发环境下的配置文件
.env.production 生产环境下的配置文件，使用打包优化配置
.env.preview 预发布版本得配置文件，使用环境生产环境接口，没有进行打包优化配置
```

### 打包配置

```
publicPath = "global" 服务器的目录结构应该是test/global
location /{
    root   test;
    index  global/index.html global/index.htm;
}

```
### 配置 proxy 代理解决跨域问题

### 修复 HMR(热更新)失效

```
chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true);
}
```

### 图片压缩 image-webpack-loader

```
如果小图片直接转换base64，如果大图则会压缩

```

### 清除console 

```
如果是用webpack4使用,要用"terser-webpack-plugin": "^4.2.3" 不然会打包失败

```

### 添加打包分析

### 开启 gzip 压缩

```
CompressionWebpackPlugin
```
### 配置 externals 引入 cdn 资源

```
防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖,减少打包体积

```

### 配置多页面
```
1. 在 src 目录下新建 pages 目录存放多页面模块
2. pages目录下面默认index文件夹会默认启动index目录的路由，不然不会自动进入路由
3. 在根目录新建pages配置文件，
4. 在vue.config.js使用glob获取pages目录下的文件，/* glob对页面需要打包文件的路径进行很好的处理 */
5. 防止多页面打包卡顿
```
chainWebpack: config => {
    // 防止多页面打包卡顿
    config => config.plugins.delete("named-chunks");
    return config;
  },
```
6. 多页使用cdn、路由懒加载异常
```
// 多页面cdn添加
Object.keys(pagesInfo).forEach(page => {
    config.plugin(`html-${page}`).tap(args => {
    // html中添加cdn
    args[0].cdn = cdn;
    // 修复 Lazy loading routes Error
    args[0].chunksSortMode = "none";
    return args;
    });
});
```
```

### 开启 stylelint 检测scss, css语法
```
1. npm i -D stylelint stylelint-config-standard stylelint-config-prettier stylelint-webpack-plugin
2. https://stylelint.io/user-guide/configure 配置文档
3. 安装VS从的插件stylelint stylelint.vscode-stylelint
4. vue.config.js配置 
```
const StylelintPlugin = require("stylelint-webpack-plugin");
config.plugins = [
      ...config.plugins,
      new StylelintPlugin({
        files: ["**/*.{vue,scss,css}"],
        fix: true,
      }),
    ];
```
```

### scss全局变量

### 路由钩子配置是否登录才能进入页面

### Axios配置