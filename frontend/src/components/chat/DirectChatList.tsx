import { useChatStore } from "@/stores/chat.store";
import React from "react";
import DirectMessageCard from "./DirectMessageCard";

const DirectChatList = () => {
  const { conversations, loading } = useChatStore();

  if (!conversations) return;

  const directConversations = conversations.filter(
    (convo) => convo.type === "direct"
  );
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2 ">
      {directConversations.map((conversation) => (
        <DirectMessageCard convo={conversation} />
      ))}
    </div>
  );
};

export default DirectChatList;
