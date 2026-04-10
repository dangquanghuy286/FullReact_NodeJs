import { useFriendStore } from "@/stores/friend.store";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Users } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import InviteSuggestionList from "../newGroupChat/InviteSuggestionList";
import type { Friend } from "@/types/user";

const NewGroupChatModal = () => {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const { friends, getFriends } = useFriendStore();
  const [invitedUsers, setInvitedUsers] = useState<Friend[]>([]);
  const handleGetFriends = async () => {
    await getFriends();
  };

  const handleSelectFriend = (friend: Friend) => {
    setInvitedUsers([...invitedUsers, friend]);
    setSearch("");
  };

  const filteredFriends = friends.filter(
    (friend) =>
      friend.displayName.toLowerCase().includes(search.toLowerCase()) &&
      !invitedUsers.some((user) => user._id === friend._id),
  );
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            onClick={handleGetFriends}
            className="flex justify-center items-center size-5 rounded-full hover:bg-[#e2e8f0] cursor-pointer z-10 "
          >
            <Users className="size-4" />
            <span className="sr-only">New Group Chat</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] border-none">
          <DialogHeader>
            <DialogTitle className="capitalize ">
              Create New Group Chat
            </DialogTitle>
          </DialogHeader>
          <form action="" className="space-y-4" onSubmit={() => {}}>
            <div className="space-y-2">
              <Label htmlFor="groupName" className="text-sm font-semibold">
                Group Name
              </Label>
              <Input
                id="groupName"
                placeholder="Enter Group Name"
                className=" glass transition-smooth "
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="invite" className="text-sm font-semibold">
                Invite Friends
              </Label>

              <Input
                id="invite"
                className=" glass transition-smooth "
                placeholder="Search by username"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search && filteredFriends.length > 0 && (
                <InviteSuggestionList
                  filteredFriends={filteredFriends}
                  onSelect={handleSelectFriend}
                />
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewGroupChatModal;
