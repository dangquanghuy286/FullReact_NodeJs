import { useFriendStore } from "@/stores/friend.store";
import FriendRequestItem from "./FriendRequestItem";
import { Button } from "../ui/button";
import { toast } from "sonner";

const ReceivedRequests = () => {
  const { acceptFriendRequest, declineFriendRequest, loading, receivedList } =
    useFriendStore();

  if (!receivedList || receivedList.length === 0) {
    return (
      <p className="text-center text-gray-500 text-sm">
        No received friend requests
      </p>
    );
  }

  const handleAccept = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      toast.success("Friend request accepted!");
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await declineFriendRequest(requestId);
      toast.info("Friend request declined.");
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  return (
    <div className="space-y-3 mt-4">
      {receivedList.map((req) => (
        <FriendRequestItem
          type="received"
          key={req._id}
          requestInfo={req}
          actions={
            <div className="flex gap-2">
              <Button
                onClick={() => handleAccept(req._id)}
                disabled={loading}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                size="sm"
              >
                Accept
              </Button>

              <Button
                onClick={() => handleDecline(req._id)}
                disabled={loading}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                size="sm"
              >
                Decline
              </Button>
            </div>
          }
        />
      ))}
    </div>
  );
};

export default ReceivedRequests;
