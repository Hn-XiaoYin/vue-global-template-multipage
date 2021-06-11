const path = require("path");
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);

const TerserPlugin = require("terser-webpack-plugin"); //清除console

const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin; // 打包分析

const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i; // 文件压缩

const CompressionWebpackPlugin = require("compression-webpack-plugin");

const glob = require("glob"); // 文件路径处理，多页面打包需要

const pagesInfo = require("./pages.config");

const pages = {};

const StylelintPlugin = require("stylelint-webpack-plugin"); // stylelint检测 scss css 语法

function resolve(dir) {
  return path.join(__dirname, dir);
}
glob.sync("./src/pages/**/main.js").forEach((entry) => {
  let chunk = entry.match(/\.\/src\/pages\/(.*)\/main\.js/)[1];
  const curr = pagesInfo[chunk];
  if (curr) {
    pages[chunk] = {
      entry,
      ...curr,
      chunk: ["chunk-vendors", "chunk-common", chunk],
    };
  }
});

module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH, // 默认'/'，部署应用包时的基本 URL
  outputDir: "dist", // 'dist', 生产环境构建文件的目录
  assetsDir: "", // 相对于outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: false,
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: !IS_PROD, // 生产环境的 source map
  parallel: require("os").cpus().length > 1,
  pwa: {},
  pages,
  css: {
    extract: IS_PROD,
    sourceMap: false,
    loaderOptions: {
      scss: {
        // 向全局sass样式传入共享的全局变量, $src可以配置图片cdn前缀
        // 详情: https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
        prependData: `
        @import "assets/css/variables.scss";
        @import "assets/css/mixins.scss";
        @import "assets/css/function.scss";
        `,
      },
    },
  },
  chainWebpack: (config) => {
    // 解决iview 按需引入babel转换问题
    config.module
      .rule("view-design") // 我目前用的是新版本的iview ,旧版本的iview，用iview代替view-design
      .test(/view-design.src.*?js$/)
      .use("babel")
      .loader("babel-loader")
      .end();
    // 修复HMR
    config.resolve.symlinks(true);
    // 别名
    config.resolve.alias
      .set("@", resolve("src"))
      .set("api", resolve("src/api"))
      .set("utils", resolve("src/utils"))
      .set("plugins", resolve("src/plugins"))
      .set("views", resolve("src/views"))
      .set("store", resolve("src/store"))
      .set("assets", resolve("src/assets"))
      .set("static", resolve("src/static"))
      .set("components", resolve("src/components"));
    // 图片压缩
    if (IS_PROD) {
      config.module
        .rule("images")
        .use("image-webpack-loader")
        .loader("image-webpack-loader")
        .options({
          mozjpeg: { progressive: true, quality: 65 },
          optipng: { enabled: false },
          pngquant: { quality: [0.65, 0.9], speed: 4 },
          gifsicle: { interlaced: false },
          // webp: { quality: 75 }
        });
      // 打包分析
      config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
        {
          analyzerMode: "static",
        },
      ]);
      // gzip压缩
      config.plugin("compressionPlugin").use(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8,
        })
      );
    }
    // 配置cdn
    const cdn = {
      // 访问https://unpkg.com/element-ui/lib/theme-chalk/index.css获取最新版本
      // css: ["//unpkg.com/element-ui@2.10.1/lib/theme-chalk/index.css"],
      js: [
        "//unpkg.com/vue@2.6.10/dist/vue.min.js", // 访问https://unpkg.com/vue/dist/vue.min.js获取最新版本
        "//unpkg.com/vue-router@3.0.6/dist/vue-router.min.js",
        "//unpkg.com/vuex@3.1.1/dist/vuex.min.js",
        "//unpkg.com/axios@0.19.0/dist/axios.min.js",
      ],
    };
    // 防止多页面打包卡顿
    (config) => config.plugins.delete("named-chunks");
    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    // 多页面cdn添加
    Object.keys(pagesInfo).forEach((page) => {
      config.plugin(`html-${page}`).tap((args) => {
        // html中添加cdn
        args[0].cdn = cdn;
        // 修复 Lazy loading routes Error
        args[0].chunksSortMode = "none";
        return args;
      });
    });
    return config;
  },
  configureWebpack: (config) => {
    config.plugins = [
      ...config.plugins,
      new StylelintPlugin({
        files: ["**/*.{vue,scss,css}"],
        fix: true,
      }),
    ];
    if (IS_PROD) {
      let optimization = {
        runtimeChunk: "single",
        splitChunks: {
          chunks: "all",
          maxInitialRequests: Infinity,
          minSize: 20000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                )[1];
                // npm package names are URL-safe, but some servers don't like @ symbols
                return `npm.${packageName.replace("@", "")}`;
              },
            },
          },
        },
        // 具体代码
        minimize: true,
        minimizer: [
          new TerserPlugin({
            parallel: true,
            sourceMap: true,
            terserOptions: {
              warnings: false,
              compress: {
                drop_console: true, // 注释console
                drop_debugger: true, // 注释debugger
                pure_funcs: ["console.log"],
              },
            },
          }),
        ],
      };
      Object.assign(config, {
        optimization,
      });
    }

    config.externals = {
      vue: "Vue",
      "vue-router": "VueRouter",
      vuex: "Vuex",
    };
  },
  devServer: {
    port: "8810",
    proxy: {
      "/api": {
        target: "http://192.168.3.7:8080", // 目标代理接口地址
        secure: false,
        changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        // ws: true, // 是否启用websockets
        pathRewrite: {
          "^/api": "/",
        },
      },
    },
  },
};
