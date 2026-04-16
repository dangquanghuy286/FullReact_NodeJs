import { useFriendStore } from "@/stores/friend.store";
import FriendRequestItem from "./FriendRequestItem";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

const ReceivedRequests = () => {
  const { acceptFriendRequest, declineFriendRequest, loading, receivedList } =
    useFriendStore();

  if (!receivedList || receivedList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-400">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
          <Check className="size-5 text-gray-300" />
        </div>
        <p className="text-sm">No received requests</p>
      </div>
    );
  }

  const handleAccept = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      toast.success("Friend request accepted!");
    } catch {
      console.error("Error accepting friend request");
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await declineFriendRequest(requestId);
      toast.info("Friend request declined.");
    } catch {
      console.error("Error declining friend request");
    }
  };

  return (
    <div className="space-y-2 max-h-72 overflow-y-auto beautiful-scrollbar pr-1">
      {receivedList.map((req) => (
        <FriendRequestItem
          type="received"
          key={req._id}
          requestInfo={req}
          actions={
            <div className="flex gap-1.5">
              <button
                onClick={() => handleAccept(req._id)}
                disabled={loading}
                className="size-8 rounded-lg bg-[#00c0d1] text-white flex items-center justify-center
                  hover:bg-[#009fb3] active:scale-95 transition-all duration-150
                  disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Check className="size-4" />
              </button>
              <button
                onClick={() => handleDecline(req._id)}
                disabled={loading}
                className="size-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 flex items-center justify-center
                  hover:bg-red-50 hover:text-red-400 active:scale-95 transition-all duration-150
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="size-4" />
              </button>
            </div>
          }
        />
      ))}
    </div>
  );
};

export default ReceivedRequests;
