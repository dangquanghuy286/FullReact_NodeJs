import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface IUserAvatarProps {
  type: "sidebar" | "chat" | "profile";
  name?: string;
  avatarUrl?: string;
  className?: string;
}
const UserAvatar = ({ type, name, avatarUrl, className }: IUserAvatarProps) => {
  const bgColor = !avatarUrl
    ? {
        sidebar: "bg-blue-500",
        chat: "bg-green-500",
        profile: "bg-purple-500",
      }[type]
    : undefined;
  if (!name) return null;
  return (
    <Avatar
      className={cn(
        "rounded-full",
        className ?? "",
        type === "sidebar" ? "size-10" : type === "chat" ? "size-8" : "size-16",
        bgColor
      )}
    >
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback className={`${bgColor} text-white font-semibold`}>
        {name?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
