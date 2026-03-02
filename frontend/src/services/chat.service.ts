// services/chat.service.ts
import api from "@/lib/axios";
import type { Conversation } from "@/types/chat";

export const chatService = {
  async fetchConversations(): Promise<{ conversations: Conversation[] }> {
    const response = await api.get("/conversation");
    // BE trả về "conversation", map lại thành "conversations"
    return { conversations: response.data.conversation ?? [] };
  },
};
