import { useFriendStore } from "@/stores/friend.store";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { UserPlus, Users } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import InviteSuggestionList from "../newGroupChat/InviteSuggestionList";
import type { Friend } from "@/types/user";
import SelectedUsersList from "../newGroupChat/SelectedUsersList";
import { toast } from "sonner";
import { useChatStore } from "@/stores/chat.store";
import { useTranslation } from "react-i18next";

const NewGroupChatModal = () => {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const { friends, getFriends } = useFriendStore();
  const [invitedUsers, setInvitedUsers] = useState<Friend[]>([]);
  const { t } = useTranslation();
  const { loading, createConversation } = useChatStore();
  // Handle fet friend
  const handleGetFriends = async () => {
    await getFriends();
    setOpen(true);
  };
  // Handle select friend
  const handleSelectFriend = (friend: Friend) => {
    setInvitedUsers([...invitedUsers, friend]);
    setSearch("");
  };
  // Handle remove
  const handleRemoveFriend = (friends: Friend) => {
    setInvitedUsers(invitedUsers.filter((user) => user._id !== friends._id));
  };
  // Handle create group  chat
  const handCreateGroupChat = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (invitedUsers.length === 0) {
        toast.warning(t("groupChat.invite.minWarning"));
        return;
      }

      await createConversation(
        "group",
        groupName,
        invitedUsers.map((user) => user._id),
      );
      setSearch("");
      setInvitedUsers([]);
      setOpen(false);
    } catch (error) {
      console.error("Error creating group chat:", error);
    }
  };

  const filteredFriends = friends.filter(
    (friend) =>
      friend.displayName.toLowerCase().includes(search.toLowerCase()) &&
      !invitedUsers.some((user) => user._id === friend._id),
  );

  return (
    <>
      <span
        role="button"
        onClick={handleGetFriends}
        className="flex justify-center items-center size-5 rounded-full  cursor-pointer z-10"
      >
        <Users className="size-4" />
        <span className="sr-only">{t("groupChat.actions.newGroup")}</span>
      </span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] border-none">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#00c0d1] to-[#007a8a]" />
              <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
                {t("groupChat.title")}
              </DialogTitle>
            </div>
          </DialogHeader>
          <form action="" className="space-y-4" onSubmit={handCreateGroupChat}>
            {/* Group Name */}
            <div className="space-y-2">
              <Label htmlFor="groupName" className="text-sm font-semibold">
                {t("groupChat.groupName.label")}
              </Label>
              <Input
                id="groupName"
                placeholder={t("groupChat.groupName.placeholder")}
                className="glass transition-smooth"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>
            {/* Invite Friends */}
            <div className="space-y-2">
              <Label htmlFor="invite" className="text-sm font-semibold">
                {t("groupChat.invite.label")}
              </Label>
              {/* Search Input */}
              <Input
                id="invite"
                className="glass transition-smooth"
                placeholder={t("groupChat.invite.placeholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search && filteredFriends.length > 0 && (
                <InviteSuggestionList
                  filteredFriends={filteredFriends}
                  onSelect={handleSelectFriend}
                />
              )}
              {/* Selected List */}
              <SelectedUsersList
                invitedUsers={invitedUsers}
                onRemove={handleRemoveFriend}
              />
            </div>
            {/* Action Buttons */}
            <DialogFooter>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 text-white 
           bg-linear-to-r from-[#84dee6] to-cyan-500 
            hover:bg-linear-to-r hover:from-[#84dee6] hover:to-cyan-500
           transition-smooth duration-300"
              >
                {loading ? (
                  t("groupChat.actions.creating")
                ) : (
                  <>
                    <UserPlus className="size-4 mr-2" />
                    {t("groupChat.actions.createNew")}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewGroupChatModal;
