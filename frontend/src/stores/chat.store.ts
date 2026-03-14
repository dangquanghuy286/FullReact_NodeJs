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
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        conversations: state.conversations,
      }),
    },
  ),
);
