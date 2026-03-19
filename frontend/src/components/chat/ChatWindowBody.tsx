import { useChatStore } from "@/stores/chat.store";
import React, { useEffect, useRef } from "react";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import MessageItem from "./MessageItem";

const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
    fetchMessages,
  } = useChatStore();

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    }
  }, [activeConversationId]);

  const messages = allMessages[activeConversationId!]?.items ?? [];
  const selectedConvo = conversations.find(
    (c) => c._id === activeConversationId,
  );

  // Derived directly — no state/effect needed
  const seenBy = selectedConvo?.seenBy ?? [];
  const lastMessageStatus: "delivered" | "seen" = selectedConvo?.lastMessage
    ? seenBy.length > 0
      ? "seen"
      : "delivered"
    : "delivered";

  // Auto-scroll xuống tin nhắn mới nhất
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!selectedConvo) return <ChatWelcomeScreen />;

  if (!messages || messages.length === 0)
    return (
      <div className="flex h-full items-center justify-center">
        Chưa có tin nhắn nào trong cuộc trò chuyện
      </div>
    );

  return (
    <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden">
      <div className="flex flex-col overflow-y-auto overflow-x-hidden beautiful-scrollbar flex-1">
        {messages.map((message, index) => (
          <MessageItem
            key={message._id ?? index}
            message={message}
            index={index}
            messages={messages}
            selectedConvo={selectedConvo}
            lastMessageStatus={lastMessageStatus}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatWindowBody;
