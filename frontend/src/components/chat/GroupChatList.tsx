import { useChatStore } from "@/stores/chat.store";
import GroupMessageCard from "./GroupMessageCard";

const GroupChatList = () => {
  const { conversations, loading } = useChatStore();

  if (loading)
    return <div className="p-2 text-muted-foreground text-sm">Đang tải...</div>;

  if (!conversations || conversations.length === 0)
    return (
      <div className="p-2 text-muted-foreground text-sm">
        Không có nhóm chat nào
      </div>
    );

  const groupConversations = conversations.filter(
    (convo) => convo.type === "group",
  );

  if (groupConversations.length === 0)
    return (
      <div className="p-2 text-muted-foreground text-sm">
        Không có nhóm chat nào
      </div>
    );

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {groupConversations.map((conversation) => (
        <GroupMessageCard convo={conversation} key={conversation._id} /> // ✅ thêm key
      ))}
    </div>
  );
};

export default GroupChatList;
