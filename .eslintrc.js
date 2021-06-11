module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 6,
    sourceType: "module",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-alert": 0, //禁止使用alert confirm prompt
    "no-array-constructor": 2, //禁止使用数组构造器
    "no-const-assign": 2, //禁止修改const声明的变量
    "no-constant-condition": 2, //禁止在条件中使用常量表达式 if(true) if(1)
    "no-dupe-args": 2, //函数参数不能重复
    "no-duplicate-case": 2, //switch中的case标签不能重复
    "no-else-return": 2, //如果if语句里面有return,后面不能跟else语句
    "no-empty": 2, //块语句中的内容不能为空
    "no-empty-character-class": 2, //正则表达式中的[]内容不能为空
    "no-extra-parens": 2, //禁止非必要的括号
    "no-extra-semi": 2, //禁止多余的冒号
    "no-func-assign": 2, //禁止重复的函数声明
    "no-irregular-whitespace": 2,
    "linebreak-style": [0, "unix"], //换行风格
    "no-multi-spaces": 1,
    "no-multi-str": 2, //字符串不能用\换行
    "no-multiple-empty-lines": [1, { max: 1 }], //空行最多不能超过2行
    "no-param-reassign": 2, //禁止给参数重新赋值
    "no-redeclare": 2, //禁止重复声明变量
    "no-sparse-arrays": 2, //禁止稀疏数组， [1,,2]
    "no-trailing-spaces": 1, //一行结束后面不要有空格
    "no-undef": 1, //不能有未定义的变量
    // camelcase: 2, //强制驼峰法命名
    "comma-spacing": 0, //逗号前后的空格
    "comma-style": [2, "last"], //逗号风格，换行时在行首还是行尾
    "lines-around-comment": 0, //行前/行后备注
    "max-params": [0, 3], //函数最多只能有3个参数
    "space-before-function-paren": 0,
    "arrow-parens": 0, //箭头函数用小括号括起来
    "arrow-spacing": ["error", { before: true, after: true }], //=>的前/后括号
  },
};
