import { useFriendStore } from "@/stores/friend.store";
import React, { useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { MessageCircleMore, Users } from "lucide-react";
import { Card } from "../ui/card";
import UserAvatar from "../chat/UserAvatar";
import { useChatStore } from "@/stores/chat.store";

const FriendListModal = () => {
  const { friends, getFriends } = useFriendStore();
  const { createConversation } = useChatStore();
  useEffect(() => {
    getFriends();
  }, []);

  const handleAddConversation = async (friendId: string) => {
    await createConversation("direct", "", [friendId]);
  };

  return (
    <DialogContent className="glass max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl capitalize">
          <MessageCircleMore className="size-5" />
          Start a new chat
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <h1 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
          Your Friends
        </h1>

        {friends.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="size-12 mx-auto mb-3 opacity-50" />
            <p>You don't have any friends yet.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {friends.map((friend) => (
              <Card
                key={friend._id}
                onClick={() => handleAddConversation(friend._id)}
                className="p-3 cursor-pointer transition-smooth glass group/friendCard"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <UserAvatar
                      type="sidebar"
                      name={friend.displayName}
                      avatarURL={friend.avatarURL}
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <h3 className="font-medium">{friend.displayName}</h3>
                    <span className="text-sm text-muted-foreground">
                      @{friend.username}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DialogContent>
  );
};

export default FriendListModal;
