import { useAuthStore } from "@/stores/auth.store";
import axios from "axios";
//Tự động gửi cookie trong mọi request
//Tự động đổi URL giữa dev và production
const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true, //Dùng để gửi cookie, token ở dạng cookie trong request.
});

// Gắn access Token vào req header
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
export default api;
