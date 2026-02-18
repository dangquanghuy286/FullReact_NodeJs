import type { Conversation } from "@/types/chat";
import React from "react";
import ChatCard from "./ChatCard";
import { useAuthStore } from "@/stores/auth.store";
import { useChatStore } from "@/stores/chat.store";
import { cn } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import UnreadCount from "./UnreadCount";

const DirectMessageCard = ({ convo }: { convo: Conversation }) => {
  const { user } = useAuthStore();
  const { activeConversationId, setActiveConversationId, messages } =
    useChatStore();
  if (!user) return null;

  const otherUser = convo.participants.find((u) => u._id !== user._id);
  if (!otherUser) return null;

  const unreadCount = convo.unreadCounts?.[user._id] || 0;

  const lastMessage = convo.lastMessage?.content || "No messages yet";

  const handleSelectConversation = async (id: string) => {
    setActiveConversationId(id);
    if (!messages[id]) {
      // Optionally, you can fetch messages here if not already loaded
    }
  };
  return (
    <ChatCard
      convoId={convo._id}
      name={otherUser.displayName ?? "Unknown User"}
      timestamp={
        convo.lastMessage?.createdAt
          ? new Date(convo.lastMessage.createdAt)
          : undefined
      }
      isActive={activeConversationId === convo._id}
      onSelect={handleSelectConversation}
      unreadCount={unreadCount}
      leftSection={
        <>
          <UserAvatar
            type="sidebar"
            name={otherUser.displayName ?? ""}
            avatarUrl={otherUser.avatarUrl ?? undefined}
          />
          <StatusBadge status="offline" />
          {unreadCount > 0 && <UnreadCount unreadCount={unreadCount} />}
        </>
      }
      subtitle={
        <p
          className={cn(
            "text-sm truncate",
            unreadCount > 0
              ? "font-medium text-foreground"
              : "text-muted-foreground",
          )}
        >
          {lastMessage}
        </p>
      }
    />
  );
};

export default DirectMessageCard;
