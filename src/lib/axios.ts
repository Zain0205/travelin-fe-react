import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
  withCredentials: true, // Essential for httpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.warn("Authentication failed. Redirecting to login...");
      
      // Clear auth state if using Redux
      // store.dispatch(clearAuth());
      
      // Redirect to login page
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;