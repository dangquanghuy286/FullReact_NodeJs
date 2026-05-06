import { useChatStore } from "@/stores/chat.store";
import GroupMessageCard from "./GroupMessageCard";
import { useTranslation } from "react-i18next";

const GroupChatList = () => {
  const { t } = useTranslation();
  const { conversations, loading } = useChatStore();

  if (loading)
    return (
      <div className="p-2 text-muted-foreground text-sm">
        {t("chat.loading")}
      </div>
    );

  if (!conversations || conversations.length === 0)
    return (
      <div className="p-2 text-muted-foreground text-sm">
        {t("chat.noGroupChat")}
      </div>
    );

  const groupConversations = conversations.filter(
    (convo) => convo.type === "group",
  );

  if (groupConversations.length === 0)
    return (
      <div className="p-2 text-muted-foreground text-sm">
        {t("chat.noGroupChat")}
      </div>
    );

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {groupConversations.map((conversation) => (
        <GroupMessageCard convo={conversation} key={conversation._id} />
      ))}
    </div>
  );
};

export default GroupChatList;
