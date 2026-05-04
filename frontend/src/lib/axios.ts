import { useAuthStore } from "@/stores/auth.store";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

//  RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    // ❗ Nếu token hết hạn
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // gọi refresh từ store
        const newAccessToken = await useAuthStore.getState().refresh();

        // gắn lại token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // gọi lại request cũ
        return api(originalRequest);
      } catch (err) {
        // refresh fail → logout
        useAuthStore.getState().clearState();

        // redirect login
        window.location.href = "/signin";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
