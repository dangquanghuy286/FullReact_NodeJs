import { useChatStore } from "@/stores/chat.store";
import React, { useEffect } from "react";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import MessageItem from "./MessageItem";

const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
    fetchMessages,
  } = useChatStore();

  // ⭐ tự động fetch tin nhắn khi chọn conversation
  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    }
  }, [activeConversationId]);

  const messages = allMessages[activeConversationId!]?.items ?? [];

  const selectConvo = conversations.find((c) => c._id === activeConversationId);

  if (!selectConvo) return <ChatWelcomeScreen />;

  if (!messages || messages.length === 0)
    return (
      <div className="flex h-full items-center justify-center">
        Chưa có tin nhắn nào trong cuộc trò chuyện
      </div>
    );

  return (
    <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden">
      <div className="flex flex-col overflow-y-auto overflow-x-hidden beautiful-scrollbar">
        {messages.map((message, index) => (
          <MessageItem
            key={message._id ?? index}
            message={message}
            index={index}
            messages={messages}
            selectedConvo={selectConvo}
            lastMessageStatus="delivered"
          />
        ))}
      </div>
    </div>
  );
};

export default ChatWindowBody;
