import type { FriendRequest } from "@/types/user";
import type { ReactNode } from "react";
import UserAvatar from "../chat/UserAvatar";

interface RequestItemProps {
  requestInfo: FriendRequest;
  actions: ReactNode;
  type: "sent" | "received";
}

const FriendRequestItem = ({
  requestInfo,
  actions,
  type,
}: RequestItemProps) => {
  if (!requestInfo) return null;
  const info = type === "sent" ? requestInfo.to : requestInfo.from;
  if (!info) return null;

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-[#00c0d1]/30 hover:bg-[#00c0d1]/5 transition-all duration-200">
      <div className="flex items-center gap-3">
        <UserAvatar type="sidebar" name={info.displayName} />
        <div>
          <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
            {info.displayName}
          </p>
          <p className="text-xs text-gray-400">@{info.username}</p>
        </div>
      </div>
      <div className="flex gap-2">{actions}</div>
    </div>
  );
};

export default FriendRequestItem;
