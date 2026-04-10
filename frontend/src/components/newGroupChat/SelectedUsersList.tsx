import type { Friend } from "@/types/user";
import UserAvatar from "../chat/UserAvatar";
import { X } from "lucide-react";

interface SelectedUsersListProps {
  invitedUsers: Friend[];
  onRemove: (user: Friend) => void;
}

const SelectedUsersList = ({
  invitedUsers,
  onRemove,
}: SelectedUsersListProps) => {
  if (invitedUsers.length === 0) {
    return;
  }
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {invitedUsers.map((user) => (
        <div
          key={user._id}
          className="flex items-center gap-2 text-sm rounded-full px-3 py-1 
               bg-gray-100 dark:bg-gray-800 
               text-gray-800 dark:text-gray-200
               shadow-sm
               transition-all duration-200
               hover:shadow-md "
        >
          <UserAvatar
            type="chat"
            name={user.displayName}
            avatarUrl={user.avatarUrl}
          />

          <span className="max-w-[100px] truncate">{user.displayName}</span>

          <X
            className="size-3 cursor-pointer 
                 text-gray-500 dark:text-gray-400
                 transition-all duration-200
                 hover:text-red-500 hover:scale-125"
            onClick={() => onRemove(user)}
          />
        </div>
      ))}
    </div>
  );
};

export default SelectedUsersList;
