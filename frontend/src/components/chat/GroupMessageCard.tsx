import { useAuthStore } from "@/stores/auth.store";
import { useChatStore } from "@/stores/chat.store";
import type { Conversation } from "@/types/chat";
import React from "react";
import ChatCard from "./ChatCard";



const GroupMessageCard = ({ convo }: { convo: Conversation }) => {
  const { user } = useAuthStore();
  const { activeConversationId, setActiveConversationId, messages } =
    useChatStore();
  if (!user) return null;

  const unreadCount = convo.unreadCounts?.[user._id] || 0;

  const name = convo.group?.name || "Unnamed Group";

  const handleSelectConversation = async (id: string) => {
    setActiveConversationId(id);
    if (!messages[id]) {
      // Optionally, you can fetch messages here if not already loaded
    }
  };
  return (
  <ChatCard
    convoId={convo._id}
    name={name}
    timestamp={
      convo.lastMessage?.createdAt
        ? new Date(convo.lastMessage.createdAt)
        : undefined
    }
    isActive={activeConversationId === convo._id}
    onSelect={handleSelectConversation}
    unreadCount={unreadCount}
    leftSection={null}
    subtitle={
      <p className="text-sm truncate text-muted-foreground">
        {
          convo.participants.length
        } thành viên
      </p>
    }
  />
);


};

export default GroupMessageCard;
