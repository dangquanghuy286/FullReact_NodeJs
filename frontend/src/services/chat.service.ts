import api from "@/lib/axios";
import type { ConversationResponse } from "@/types/chat";

export const chatService = {
  async fetchConversations(): Promise<ConversationResponse> {
    const response = await api.get("/conversation");
    return response.data;
  },
};
