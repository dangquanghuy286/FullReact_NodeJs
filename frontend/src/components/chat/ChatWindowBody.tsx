import { useChatStore } from "@/stores/chat.store";
import { useEffect, useLayoutEffect, useRef } from "react";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import MessageItem from "./MessageItem";
import { useAuthStore } from "@/stores/auth.store";
import InfinityScroll from "react-infinite-scroll-component";

const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
    fetchMessages,
  } = useChatStore();

  const { user } = useAuthStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const messages = allMessages[activeConversationId!]?.items ?? [];
  const reversedMessages = [...messages].reverse();
  const hasMore = allMessages[activeConversationId!]?.hasMore ?? false;
  const key = `chat-scroll-${activeConversationId}`;
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !bottomRef.current) return;

    const isNearBottom = container.scrollTop < 100;

    if (isNearBottom) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length]);

  const fetchMoreMessage = async () => {
    if (!activeConversationId) {
      return;
    }

    try {
      await fetchMessages(activeConversationId);
    } catch (error) {
      console.error("Error fetching more messages", error);
    }
  };

  const handleScrollSave = () => {
    const container = containerRef.current;
    if (!container || !activeConversationId) {
      return;
    }

    sessionStorage.setItem(
      key,
      JSON.stringify({
        scrollTop: container.scrollTop,
        scrollHeight: container.scrollHeight,
      }),
    );
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const item = sessionStorage.getItem(key);

    if (item) {
      const { scrollTop } = JSON.parse(item);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          container.scrollTop = scrollTop;
        });
      });
    }
  }, [messages.length]);

  if (!selectedConvo) return <ChatWelcomeScreen />;

  if (!messages || messages.length === 0)
    return (
      <div className="flex h-full items-center justify-center">
        No messages in this conversation yet
      </div>
    );

  return (
    <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden">
      <div
        className="flex flex-col-reverse overflow-y-auto overflow-x-hidden beautiful-scrollbar flex-1"
        id="scrollableDiv"
        ref={containerRef}
        onScroll={handleScrollSave}
      >
        <div ref={bottomRef} />

        <InfinityScroll
          dataLength={messages.length}
          next={fetchMoreMessage}
          hasMore={hasMore}
          scrollableTarget="scrollableDiv"
          inverse={true}
          loader={<p>Loading...</p>}
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            overflow: "visible",
          }}
        >
          {reversedMessages.map((message, index) => (
            <MessageItem
              key={message._id}
              message={message}
              index={index}
              messages={reversedMessages}
              selectedConvo={selectedConvo}
              lastMessageStatus={lastMessageStatus}
            />
          ))}
        </InfinityScroll>
      </div>
    </div>
  );
};

export default ChatWindowBody;
