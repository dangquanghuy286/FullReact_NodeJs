import { useChatStore } from "@/stores/chat.store";
import React from "react";
import GroupMessageCard from "./GroupMessageCard";

const GroupChatList = () => {
  const { conversations, loading } = useChatStore();

  if (!conversations) return;

  const groupConversations = conversations.filter(
    (convo) => convo.type === "group"
  );
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2 ">
      {groupConversations.map((conversation) => (
        <GroupMessageCard convo={conversation} />
      ))}
    </div>
  );
};

export default GroupChatList;
