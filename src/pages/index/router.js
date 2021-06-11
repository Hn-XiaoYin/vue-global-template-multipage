import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./views/home";
import Goods from "./views/goods/index";
import Mine from "./views/mine/index";
import Login from "./views/login/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/goods",
    name: "Goods",
    component: Goods,
  },
  {
    path: "/mine",
    name: "Mine",
    component: Mine,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
});

// 路由钩子判断是否要登录
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.meta.requireAuth) {
    // 判断该路由是否需要登录权限
    if (token) {
      // 通过vuex state获取当前的token是否存在
      next();
    } else {
      next({
        path: "/login",
        query: { redirect: to.fullPath }, // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  } else {
    next();
  }
});
export default router;
