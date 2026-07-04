// services/chat.service.ts
import api from "@/lib/axios";
import type { Conversation, Message } from "@/types/chat";

interface FetchMessageResponse {
  messages: Message[];
  cursor?: string;
}

const pageLimit = 50;

export const chatService = {
  async fetchConversations(): Promise<{ conversations: Conversation[] }> {
    const response = await api.get("/conversation");
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
    images: File[] = [],
    conversationId?: string,
  ) {
    const formData = new FormData();
    formData.append("recipientId", recipientId);
    formData.append("content", content);
    if (conversationId) formData.append("conversationId", conversationId);
    images.forEach((file) => formData.append("images", file));

    const res = await api.post("/messages/direct", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.message;
  },

  async sendGroupMessage(
    conversationId: string,
    content: string = "",
    images: File[] = [],
  ) {
    const formData = new FormData();
    formData.append("conversationId", conversationId);
    formData.append("content", content);
    images.forEach((file) => formData.append("images", file));

    const res = await api.post("/messages/group", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.message;
  },

  async markAsSeen(conversationId: string) {
    const res = await api.patch(`/conversation/${conversationId}/seen`);
    return res.data;
  },

  async createConversation(
    type: "direct" | "group",
    name: string,
    memberIds: string[],
  ) {
    const res = await api.post("/conversation", {
      type,
      name,
      memberIds,
    });
    return res.data.conversation;
  },
};
