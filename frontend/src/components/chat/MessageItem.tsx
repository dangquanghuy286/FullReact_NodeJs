import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";
import React from "react";
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
  const prev = messages[index - 1];

  const isGroupBreak =
    index === 0 ||
    message.senderId !== prev?.senderId ||
    new Date(message.createdAt).getTime() - new Date(prev.createdAt).getTime() >
      5 * 60 * 1000; // cách nhau > 5 phút;

  const participant = selectedConvo.participants.find(
    (p: Participant) => p._id.toString() === message.senderId.toString(),
  );
  return (
    <div
      className={cn(
        "flex gap-2 message-bounce mb-2",
        message.isOwnMessage ? "justify-end" : "justify-start",
      )}
    >
      {/* Avata */}
      {!message.isOwnMessage && (
        <div className="w-8">
          {isGroupBreak && (
            <UserAvatar
              type="chat"
              name={participant?.displayName ?? "Người dùng hệ thống! "}
              avatarUrl={participant?.avatarUrl ?? undefined}
            />
          )}{" "}
        </div>
      )}
      {/* Tin nhắn */}
      <div
        className={cn(
          "max-w-xs lg:max-w-md space-y-1 flex flex-col",
          message.isOwnMessage ? "items-end" : " items-start",
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
        {/* Time */}
        {isGroupBreak && (
          <span className="text-[11px] text-gray-400 px-1">
            {formatMessageTime(new Date(message.createdAt))}
          </span>
        )}
        {/* Status (chỉ hiện với tin nhắn cuối cùng của chính mình) */}
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
  );
};

export default MessageItem;
