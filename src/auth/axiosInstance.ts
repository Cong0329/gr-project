import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/authSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_NODEJS_BACKEND_URL,
  withCredentials: true, // RẤT QUAN TRỌNG để gửi cookie
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
  
      const isTokenExpired =
        error.response?.status === 403 &&
        error.response?.data?.message === "jwt expired"; // ← kiểm tra kỹ message
  
      if (isTokenExpired && !originalRequest._retry) {
        originalRequest._retry = true;
  
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => axiosInstance(originalRequest))
            .catch((err) => Promise.reject(err));
        }
  
        isRefreshing = true;
  
        try {
          await axios.post(
            `${import.meta.env.VITE_NODEJS_BACKEND_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );
  
          processQueue(null);
          isRefreshing = false;
  
          return axiosInstance(originalRequest);
        } catch (err) {
          processQueue(err, null);
          isRefreshing = false;
  
          store.dispatch(logout());
          await axios.post(
            `${import.meta.env.VITE_NODEJS_BACKEND_URL}/auth/logout`,
            {},
            { withCredentials: true }
          );
          window.location.href = "/";
          return Promise.reject(err);
        }
      }
  
      return Promise.reject(error);
    }
  );
  

export default axiosInstance;
