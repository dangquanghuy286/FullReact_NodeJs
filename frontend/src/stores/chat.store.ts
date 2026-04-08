import { chatService } from "@/services/chat.service";
import type { ChatState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./auth.store";
import { useSocketStore } from "./socket.store";

// Helper chống duplicate
const appendUnique = (items: any[], message: any) => {
  if (items.some((m) => m._id === message._id)) return items;
  return [...items, message];
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      convoLoading: false,
      messageLoading: false,

      setActiveConversationId: (id) => {
        set({ activeConversationId: id });
      },

      reset: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          convoLoading: false,
          messageLoading: false,
        });
      },

      fetchConversations: async () => {
        try {
          set({ convoLoading: true });
          const { conversations } = await chatService.fetchConversations();
          set({ conversations, convoLoading: false });
        } catch (error) {
          console.error("Failed to fetch conversations:", error);
          set({ convoLoading: false });
        }
      },

      fetchMessages: async (conversationId) => {
        const { activeConversationId, messages } = get();
        const { user } = useAuthStore.getState();

        const convoId = conversationId ?? activeConversationId;
        if (!convoId) return;

        const current = messages?.[convoId];
        const nextCursor =
          current?.nextCursor === undefined ? "" : current.nextCursor;

        if (nextCursor === null) return;

        set({ messageLoading: true });

        try {
          const { messages: fetched, cursor } = await chatService.fetchMessages(
            convoId,
            nextCursor,
          );

          const processed = (fetched ?? []).map((m) => ({
            ...m,
            isOwnMessage: m.senderId === user?._id,
          }));

          set((state) => {
            const prev = state.messages[convoId]?.items ?? [];

            const merged = [...processed, ...prev];
            const deduplicated = Array.from(
              new Map(merged.map((m) => [m._id, m])).values(),
            );

            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: deduplicated,
                  hasMore: cursor !== null,
                  nextCursor: cursor ?? null,
                },
              },
            };
          });
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        } finally {
          set({ messageLoading: false });
        }
      },

      sendDirectMessage: async (recipientId, content, imgUrl) => {
        try {
          const { activeConversationId } = get();
          const { user } = useAuthStore.getState();

          const message = await chatService.sendDirectMessage(
            recipientId,
            content ?? "",
            imgUrl,
            activeConversationId ?? undefined,
          );

          if (!activeConversationId) return;

          set((state) => {
            const prevItems = state.messages[activeConversationId]?.items ?? [];

            return {
              messages: {
                ...state.messages,
                [activeConversationId]: {
                  ...state.messages[activeConversationId],
                  items: appendUnique(prevItems, {
                    ...message,
                    isOwnMessage:
                      message.senderId?.toString() === user?._id?.toString(),
                  }),
                },
              },
              conversations: state.conversations.map((c) =>
                c._id === activeConversationId ? { ...c, seenBy: [] } : c,
              ),
            };
          });
        } catch (error) {
          console.error("Lỗi xảy ra khi gửi qua direct", error);
          throw error;
        }
      },

      sendGroupMessage: async (conversationId, content, imgUrl) => {
        try {
          const { user } = useAuthStore.getState();

          const message = await chatService.sendGroupMessage(
            conversationId,
            content ?? "",
            imgUrl,
          );

          set((state) => {
            const prevItems = state.messages[conversationId]?.items ?? [];

            return {
              messages: {
                ...state.messages,
                [conversationId]: {
                  ...state.messages[conversationId],
                  items: appendUnique(prevItems, {
                    ...message,
                    isOwnMessage:
                      message.senderId?.toString() === user?._id?.toString(),
                  }),
                },
              },
            };
          });
        } catch (error) {
          console.error("Lỗi xảy ra khi gửi qua group", error);
          throw error;
        }
      },

      addMessage: async (message) => {
        try {
          const { user } = useAuthStore.getState();
          const { fetchMessages } = get();

          message.isOwnMessage = message.senderId === user?._id;
          const convoId = message.conversationId;

          let prevItems = get().messages[convoId]?.items ?? [];

          if (prevItems.length === 0) {
            await fetchMessages(convoId);
            prevItems = get().messages[convoId]?.items ?? [];
          }

          set((state) => {
            const currentItems = state.messages[convoId]?.items ?? [];

            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: appendUnique(currentItems, message),
                  hasMore: state.messages[convoId]?.hasMore ?? false,
                  nextCursor: state.messages[convoId]?.nextCursor ?? null,
                },
              },
            };
          });
        } catch (error) {
          console.error("Lỗi xảy ra khi add message", error);
        }
      },

      updateConversation: (conversation) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c._id === conversation._id ? { ...c, ...conversation } : c,
          ),
        }));
      },

      markAsSeen: async () => {
        try {
          const { user } = useAuthStore.getState();
          const { activeConversationId, conversations } = get();

          if (!activeConversationId || !user) return;

          const convo = conversations.find(
            (c) => c._id === activeConversationId,
          );

          if (!convo) return;

          if ((convo.unreadCounts?.[user._id] ?? 0) === 0) return;

          await chatService.markAsSeen(activeConversationId);

          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId && c.lastMessage
                ? {
                    ...c,
                    unreadCounts: {
                      ...c.unreadCounts,
                      [user._id]: 0,
                    },
                  }
                : c,
            ),
          }));
        } catch (error) {
          console.error("Lỗi xảy ra khi gọi markSEEN !", error);
        }
      },

      addConvo: (convo) => {
        set((state) => {
          const exists = state.conversations.some(
            (c) => c._id.toString() === convo._id.toString(),
          );

          return {
            conversations: exists
              ? state.conversations
              : [convo, ...state.conversations],
            activeConversationId: convo._id,
          };
        });
      },
      createConversation: async (type, name, memberIds) => {
        try {
          const conversation = await chatService.createConversation(
            type,
            name,
            memberIds,
          );

          get().addConvo(conversation);

          useSocketStore
            .getState()
            .socket?.emit("join-conversation", conversation._id);
        } catch (error) {
          console.error("Lỗi xảy ra khi tạo conversation", error);
        }
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        conversations: state.conversations,
      }),
    },
  ),
);
