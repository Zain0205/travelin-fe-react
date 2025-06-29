import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import Cookies from "js-cookie";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const response = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:3000"}/api/user/refresh`, { refreshToken }, { withCredentials: true });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Update cookies
        Cookies.set("accessToken", accessToken, { secure: true, sameSite: "strict" });
        Cookies.set("refreshToken", newRefreshToken, { secure: true, sameSite: "strict" });

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;