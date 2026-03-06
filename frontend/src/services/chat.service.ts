// services/chat.service.ts
import api from "@/lib/axios";
import type { Conversation } from "@/types/chat";

export const chatService = {
  async fetchConversations(): Promise<{ conversations: Conversation[] }> {
    const response = await api.get("/conversation");
    // BE trả về "conversation", nếu không có thì trả về mảng rỗng để tránh lỗi khi frontend cố gắng truy cập vào thuộc tính của undefined
    return { conversations: response.data.conversation ?? [] };
  },
};
