import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";
import { useEffect, useRef, useState } from "react";
import UserAvatar from "./UserAvatar";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface MessageItemProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedConvo: Conversation;
  lastMessageStatus: "seen" | "delivered" | "sent";
}

const MessageItem = ({
  message,
  index,
  messages,
  selectedConvo,
  lastMessageStatus,
}: MessageItemProps) => {
  const prev = index + 1 < messages.length ? messages[index + 1] : undefined;
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isShowTime =
    index === 0 ||
    !prev ||
    new Date(message.createdAt).getTime() -
      new Date(prev?.createdAt).getTime() >
      300000;

  const isGroupBreak =
    isShowTime || !prev || message.senderId !== prev.senderId;

  const participant = selectedConvo.participants.find(
    (p: Participant) => p._id.toString() === message.senderId.toString(),
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={ref}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0) scale(1)"
            : message.isOwnMessage
              ? "translateX(16px) scale(0.97)"
              : "translateX(-16px) scale(0.97)",
          transition: `opacity 0.28s ease, transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)`,
          transitionDelay: `${Math.min(index * 18, 120)}ms`,
        }}
        className={cn(
          "flex gap-2 mb-2",
          message.isOwnMessage ? "justify-end" : "justify-start",
        )}
      >
        {/* Avatar */}
        {!message.isOwnMessage && (
          <div className="w-8">
            {isGroupBreak && (
              <UserAvatar
                type="chat"
                name={participant?.displayName ?? "Người dùng hệ thống!"}
                avatarURL={participant?.avatarURL ?? undefined}
              />
            )}
          </div>
        )}

        {/* Tin nhắn */}
        <div
          className={cn(
            "max-w-xs lg:max-w-md space-y-1 flex flex-col",
            message.isOwnMessage ? "items-end" : "items-start",
          )}
        >
          <Card
            className={cn(
              "px-4 py-2 shadow-sm transition-all",
              message.isOwnMessage
                ? "bg-[#00c0d1] text-white rounded-2xl rounded-br-sm"
                : "bg-gray-100 text-black rounded-2xl rounded-bl-sm",
            )}
          >
            <p className="text-sm leading-relaxed break-words">
              {message.content}
            </p>
          </Card>

          {/* Status */}
          {message.isOwnMessage &&
            message._id === selectedConvo.lastMessage?._id && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs px-1.5 py-0.5 h-4 border-0",
                  lastMessageStatus === "seen"
                    ? "bg-green-100 text-green-800"
                    : lastMessageStatus === "delivered"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800",
                )}
              >
                {lastMessageStatus}
              </Badge>
            )}
        </div>
      </div>

      {/* Time */}
      {isShowTime && (
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(4px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            transitionDelay: `${Math.min(index * 18 + 80, 200)}ms`,
          }}
          className="text-xs text-gray-400 text-center my-2 opacity-80"
        >
          {formatMessageTime(new Date(message.createdAt))}
        </div>
      )}
    </>
  );
};

export default MessageItem;
