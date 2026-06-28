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
    const existingSocket = get().socket;
    if (existingSocket) return;

    const socket: Socket = io(baseURL, {
      auth: (cb) => {
        cb({ token: useAuthStore.getState().accessToken });
      },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1500,
    });

    set({ socket });

    socket.on("connect", () => {});

    // ── Xử lý lỗi xác thực ──────────────────────────────
    socket.on("connect_error", async (err) => {
      const reason = err.message;

      if (reason === "TOKEN_EXPIRED") {
        // Chặn vòng lặp retry với token cũ trong lúc đang refresh
        socket.io.opts.reconnection = false;

        try {
          await useAuthStore.getState().refresh();
          socket.io.opts.reconnection = true;
          socket.connect();
        } catch {
          // Refresh token cũng hết hạn/không hợp lệ → logout thật
          useAuthStore.getState().clearState();
          set({ socket: null, onlineUsers: [] });
          window.location.href = "/signin";
        }
        return;
      }

      if (reason === "TOKEN_INVALID" || reason.includes("Unauthorized")) {
        // Token sai hoàn toàn, không phải do hết hạn → logout luôn, không retry
        socket.io.opts.reconnection = false;
        useAuthStore.getState().clearState();
        set({ socket: null, onlineUsers: [] });
        window.location.href = "/signin";
      }
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
          avatarURL: null,
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
        useChatStore.getState().markAsSeen();
      }
      useChatStore.getState().updateConversation(updateConversation);
    });

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

    socket.on("new-group", (conversation) => {
      useChatStore.getState().addConvo(conversation);
      socket.emit("join-conversation", conversation._id);
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
