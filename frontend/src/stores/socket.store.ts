import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "./auth.store";
import type { SocketState } from "@/types/store";

const baseURL = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],
  connectSocket: () => {
    const accessToken = useAuthStore.getState().accessToken;

    // Lấy socket hiện tại trong store để kiểm tra hoặc sử dụng lại.
    const existingSocket = get().socket;

    // Tránh tạo nhiều socket
    if (existingSocket) return;

    // Tạo kết nối Socket.IO client → server và gửi token để xác thực.
    const socket: Socket = io(baseURL, {
      auth: { token: accessToken },
      transports: ["websocket"],
    });

    set({ socket });

    socket.on("connect", () => {
      console.log("Đã kết nối với SOCKET!");
    });

    // Online users
    socket.on("online-users", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;

    if (socket) {
      socket.disconnect();
      set({
        socket: null,
      });
    }
  },
}));
