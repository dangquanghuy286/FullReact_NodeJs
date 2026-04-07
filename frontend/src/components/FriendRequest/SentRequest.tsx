import { useFriendStore } from "@/stores/friend.store";
import React from "react";

const SentRequest = () => {
  const { sentList } = useFriendStore();

  if (!sentList || sentList.length === 0) {
    return (
      <p className="text-center text-gray-500 text-sm">
        No sent friend requests
      </p>
    );
  }
  return (
    <div className="space-y-3 mt-4">
      {sentList.map((req) => (
        <div key={req._id} className="bg-gray-100 p-4 rounded-md">
          <p className="font-medium">{req.username}</p>
          <p className="text-sm text-gray-500">Request sent</p>
        </div>
      ))}
    </div>
  );
};

export default SentRequest;
