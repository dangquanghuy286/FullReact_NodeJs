import { useFriendStore } from "@/stores/friend.store";
import FriendRequestItem from "./FriendRequestItem";
import { Clock } from "lucide-react";

const SentRequest = () => {
  const { sentList } = useFriendStore();

  if (!sentList || sentList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-400">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
          <Clock className="size-5 text-gray-300" />
        </div>
        <p className="text-sm">No sent requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-72 overflow-y-auto beautiful-scrollbar pr-1">
      {sentList.map((req) => (
        <FriendRequestItem
          key={req._id}
          requestInfo={req}
          type="sent"
          actions={
            <span className="flex items-center gap-1.5 text-xs text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full font-medium">
              <Clock className="size-3" />
              Pending
            </span>
          }
        />
      ))}
    </div>
  );
};

export default SentRequest;
