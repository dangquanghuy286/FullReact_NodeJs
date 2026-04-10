import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "./auth.store";
import type { SocketState } from "@/types/store";
import { useChatStore } from "./chat.store";

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

    // New message
    socket.on("new-message", ({ message, conversation, unreadCounts }) => {
      useChatStore.getState().addMessage(message);

      const lastMessage = {
        _id: conversation.lastMessage._id,
        content: conversation.lastMessage.content,
        createdAt: conversation.lastMessage.createdAt,
        sender: {
          _id: conversation.lastMessage.senderId,
          displayName: "",
          avatarUrl: null,
        },
      };

      const updateConversation = {
        ...conversation,
        lastMessage,
        unreadCounts,
      };

      if (
        useChatStore.getState().activeConversationId === message.conversationId
      ) {
        // Đánh dấu đã đọc
        useChatStore.getState().markAsSeen();
      }
      useChatStore.getState().updateConversation(updateConversation);
    });
    // Read message
    socket.on("read-message", ({ conversation, lastMessage }) => {
      const updated = {
        _id: conversation._id,
        lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        unreadCounts: conversation.unreadCounts,
        seenBy: conversation.seenBy,
      };

      useChatStore.getState().updateConversation(updated);
    });

    // New group conversation
    socket.on("new-group", (conversation) => {
      useChatStore.getState().addConvo(conversation);
      socket.emit("join-conversation", conversation._id);
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
