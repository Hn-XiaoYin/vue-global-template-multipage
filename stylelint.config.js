module.exports = {
  plugins: ["stylelint-scss"],
  extends: ["stylelint-config-standard", "stylelint-config-prettier"], // 扩展现有配置
  rules: {
    // 默认情况下没有打开任何规则，也没有默认值。您必须明确配置每个规则才能将其打开
    "no-empty-source": null,
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["extend", "mixin", "include", "if", "else"],
      },
    ],
  },
};
