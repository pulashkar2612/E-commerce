import axios from "axios";
import { urls } from "./urls";

const axios_instance = axios.create({
  baseURL: urls.baseURL,
  headers: { "Content-Type": "application/json" },
});

axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    const originalReq = error.config;
    if (error.response?.status === 401) {
      window.location.replace("/logout");
    }

    if (error.response?.status === 403 && !originalReq._retry) {
      originalReq._retry = true;
      // Axios Instance will fix the unlimited looping
      return axios
        .post(urls.refreshToken, {
          refreshToken: sessionStorage.getItem("refreshToken"),
        })
        .then((res) => {
          if (res.data.success) {
            sessionStorage.setItem("token", res.data.token);
            error.config.headers["Authorization"] = "Bearer " + res.data.token;
            return axios_instance(error.config);
          }
        })
        .catch((err) => {});
    }
    return Promise.reject(error);
  }
);
