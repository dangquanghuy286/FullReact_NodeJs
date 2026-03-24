// services/chat.service.ts
import api from "@/lib/axios";
import type { Conversation, Message } from "@/types/chat";

interface FetchMessageResponse {
  messages: Message[];
  cursor?: string;
}

const pageLimit = 20;

export const chatService = {
  async fetchConversations(): Promise<{ conversations: Conversation[] }> {
    const response = await api.get("/conversation");
    // BE trả về "conversation", nếu không có thì trả về mảng rỗng để tránh lỗi khi frontend cố gắng truy cập vào thuộc tính của undefined
    return { conversations: response.data.conversation ?? [] };
  },

  async fetchMessages(
    id: string,
    cursor?: string,
  ): Promise<FetchMessageResponse> {
    const response = await api.get(
      `conversation/${id}/messages?limit=${pageLimit}&cursor=${cursor ?? ""}`,
    );
    return {
      messages: response.data.messages ?? [],
      cursor: response.data.nextCursor,
    };
  },

  async sendDirectMessage(
    recipientId: string,
    content: string = "",
    imgUrl?: string,
    conversationId?: string,
  ) {
    const res = await api.post("/messages/direct", {
      recipientId,
      content,
      imgUrl,
      conversationId,
    });
    return res.data.message;
  },

  async sendGroupMessage(
    conversationId: string,
    content: string = "",
    imgUrl?: string,
  ) {
    const res = await api.post("/messages/group", {
      conversationId,
      content,
      imgUrl,
    });
    return res.data.message;
  },

  async markAsSeen(conversationId: string) {
    const res = await api.patch(`/conversation/${conversationId}/seen`);

    return res.data;
  },
};
