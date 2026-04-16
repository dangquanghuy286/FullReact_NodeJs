import type { Friend } from "@/types/user.ts";
import UserAvatar from "../chat/UserAvatar";

interface InviteSuggestionListProps {
  filteredFriends: Friend[];
  onSelect: (friend: Friend) => void;
}

const InviteSuggestionList = ({
  filteredFriends,
  onSelect,
}: InviteSuggestionListProps) => {
  if (filteredFriends.length === 0) {
    return;
  }
  return (
    <div className="border rounded-lg mt-2 max-h-[180px] overflow-y-auto divide-y ">
      {filteredFriends.map((friend) => (
        <div
          key={friend._id}
          className="p-2 cursor-pointer gap-3 flex items-center transition-all duration-200
             hover:bg-gray-100 dark:hover:bg-gray-900"
          onClick={() => onSelect(friend)}
        >
          <UserAvatar
            type="chat"
            name={friend.displayName}
            avatarURL={friend.avatarURL}
          />
          <span className="text-gray-800 dark:text-gray-200">
            {friend.displayName}
          </span>
        </div>
      ))}
    </div>
  );
};

export default InviteSuggestionList;
