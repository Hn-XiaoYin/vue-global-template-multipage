import axios from "axios";
import { Message } from "view-design";
import { getRefreshToken } from "api/user";
// 从localStorage中获取token
function getLocalToken() {
  const token = window.localStorage.getItem("token");
  console.log("token---", token);
  return token;
}

function refreshToken() {
  // instance是当前request.js中已创建的axios实例
  return getRefreshToken();
}

// 创建一个axios实例
const instance = axios.create({
  baseURL: "/api",
  timeout: 300000,
});

// 给实例添加一个setToken方法，用于登录后将最新token动态添加到header，同时将token保存在localStorage中
instance.setToken = (token) => {
  instance.defaults.headers["token"] = token;
  window.localStorage.setItem("token", token);
};

// 是否正在刷新的标记
let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式
let requests = [];
// 保存请求队列
const pendingMap = new Map();
let msssage = 0;
instance.interceptors.request.use((config) => {
  if (pendingMap.size === 0) {
    Message.loading({
      content: "加载中",
      duration: 0,
    });
  }
  if (!pendingMap.has(config.url)) {
    pendingMap.set(config.url, config);
  }
  config.headers["token"] = getLocalToken();
  console.log(config.headers);
  return config;
});

instance.interceptors.response.use(
  (response) => {
    const { code } = response.data;
    if (code === 1011) {
      const config = response.config;
      if (!isRefreshing) {
        isRefreshing = true;
        return refreshToken()
          .then((res) => {
            const { token } = res.data;
            instance.setToken(token);
            config.headers["token"] = token;
            requests.forEach((cb) => cb(token));
            requests = [];
            return instance(config);
          })
          .catch((err) => {
            console.error("refreshtoken error =>", err);
            console.log("去重新登录!");
            window.location.href = "/";
          })
          .finally(() => {
            isRefreshing = false;
          });
      }
      // 正在刷新token，将返回一个未执行resolve的promise
      return new Promise((resolve) => {
        // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
        requests.push((token) => {
          config.headers["token"] = token;
          resolve(instance(config));
        });
      });
    }
    if (pendingMap.has(response.config.url)) {
      pendingMap.delete(response.config.url);
    }
    if (pendingMap.size === 0) {
      console.log("关闭弹窗");
      Message.destroy();
    }
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
