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
      convoLoading: false,//convo loading state
      messageLoading: false,//message loading state

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
      fetchMessages:async (conversationId) => {
        const {activeConversationId,messages} = get();
        const {user}=useAuthStore.getState();
        const convoId=conversationId ?? activeConversationId
        if(!convoId) return;

        const current=messages?.[convoId];
        const nextCursor=current?.nextCursor === undefined ?"":current.nextCursor;
        if(nextCursor === null) return; //Không còn trang nào nữa

        set({ messageLoading: true });

        try {
          const {messages:fetched,cursor}=await chatService.fetchMessages( convoId,nextCursor);
          const processed=fetched.map((m)=>({
            ...m,
            isOwnMessage:m.senderId === user?._id,
          }));

          set((state) => {
            const prev=state.messages[convoId]?.items ?? [];
            const merged=prev.length > 0 ? [...prev,...processed]:processed;//Nếu đã có tin nhắn thì gộp, nếu chưa thì dùng luôn

            return {
              messages:{
                ...state.messages,
                [convoId]:{
                  items: merged,
                  hasMore: cursor !== null,
                  nextCursor: cursor ?? null,
                }
              }
            }
          })
        } catch (error) {
          
          console.error("Failed to fetch messages:", error);
        }
        finally {
          set({ messageLoading: false });
        }
      }
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        conversations: state.conversations,
      }),
    },
  ),
);
