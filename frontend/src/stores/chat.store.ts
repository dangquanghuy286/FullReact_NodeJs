import { chatService } from "@/services/chat.service";
import type { ChatState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./auth.store";

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      convoLoading: false, //convo loading state
      messageLoading: false, //message loading state

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
        if (nextCursor === null) return; //Không còn trang nào nữa

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
            const merged =
              prev.length > 0 ? [...processed, ...prev] : processed; // tin nhắn cũ lên trước

            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: merged,
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
          const { user } = useAuthStore.getState(); // 👈 thêm

          const message = await chatService.sendDirectMessage(
            recipientId,
            content ?? "",
            imgUrl,
            activeConversationId ?? undefined,
          );

          if (!activeConversationId) return;

          set((state) => ({
            messages: {
              ...state.messages,
              [activeConversationId]: {
                ...state.messages[activeConversationId],
                items: [
                  ...(state.messages[activeConversationId]?.items ?? []),
                  {
                    ...message,
                    isOwnMessage:
                      message.senderId?.toString() === user?._id?.toString(),
                  }, // 👈
                ],
              },
            },
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId ? { ...c, seenBy: [] } : c,
            ),
          }));
        } catch (error) {
          console.error("Lỗi xảy ra khi gửi qua direct", error);
          throw error;
        }
      },

      sendGroupMessage: async (conversationId, content, imgUrl) => {
        try {
          const { user } = useAuthStore.getState(); // 👈 thêm

          const message = await chatService.sendGroupMessage(
            conversationId,
            content ?? "",
            imgUrl,
          );

          set((state) => ({
            messages: {
              ...state.messages,
              [conversationId]: {
                ...state.messages[conversationId],
                items: [
                  ...(state.messages[conversationId]?.items ?? []),
                  {
                    ...message,
                    isOwnMessage:
                      message.senderId?.toString() === user?._id?.toString(),
                  }, // 👈
                ],
              },
            },
          }));
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

          // Nếu chưa load messages, fetch trước
          if (prevItems.length === 0) {
            await fetchMessages(convoId);
            prevItems = get().messages[convoId]?.items ?? [];
          }

          // Tránh duplicate
          if (prevItems.some((m) => m._id === message._id)) return;

          set((state) => ({
            messages: {
              ...state.messages,
              [convoId]: {
                items: [...(state.messages[convoId]?.items ?? []), message],
                hasMore: state.messages[convoId]?.hasMore ?? false,
                nextCursor: state.messages[convoId]?.nextCursor ?? null,
              },
            },
          }));
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

          if (!activeConversationId || !user) {
            return;
          }

          const convo = conversations.find(
            (c) => c._id === activeConversationId,
          );

          if (!convo) {
            return;
          }

          if ((convo.unreadCounts?.[user._id] ?? 0) === 0) {
            return;
          }

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
          console.error("Loi xay ra khi goi market Seen !", error);
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
