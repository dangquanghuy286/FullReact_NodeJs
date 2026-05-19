import { useAuthStore } from "@/stores/auth.store";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    // 401 → token hết hạn → thử refresh rồi retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await useAuthStore.getState().refresh();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        useAuthStore.getState().clearState();
        window.location.href = "/signin";
        return Promise.reject(err);
      }
    }

    // 403 → token sai hoàn toàn → logout luôn, không retry
    if (error.response?.status === 403) {
      useAuthStore.getState().clearState();
      window.location.href = "/signin";
    }

    return Promise.reject(error);
  },
);

export default api;
