import request from "utils/request";
import qs from "qs";

export const login = (data) => {
  return request.post("/oa/login", qs.stringify(data));
};

export const getRefreshToken = () => {
  const refreshToken = localStorage.getItem("refreshToken");
  return request.post("/oa/refresh", qs.stringify({ refreshToken }));
};

export const auth = (params) => {
  return request.get("/oa/user/auth", params);
};

export const userinfo = (params) => {
  return request.get("/oa/user/userinfo", params);
};
