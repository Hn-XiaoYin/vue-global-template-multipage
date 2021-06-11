import Vue from "vue";
import App from "./index";
import router from "./router";
// 全局引入按需引入UI库
import "plugins/iview";

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
