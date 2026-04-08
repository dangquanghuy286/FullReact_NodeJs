import { useFriendStore } from "@/stores/friend.store";
import { Card } from "../ui/card";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { MessageCircle } from "lucide-react";
import FriendListModal from "../createNewChat/FriendListModal";

const CreateNewChat = () => {
  const { getFriends } = useFriendStore();

  const handleGetFriends = async () => {
    await getFriends();
  };

  return (
    <div className="flex gap-2">
      <Card
        className="flex-1  border p-3  transition-smooth  hover:bg-muted/10 transition-all duration-300 cursor-pointer group/card border-[#00c0d1] "
        onClick={handleGetFriends}
      >
        <Dialog>
          <DialogTrigger>
            <div className="flex items-center gap-4">
              <div
                className="size-8 flex items-center justify-center rounded-full 
    bg-linear-to-r from-[#00c0d1] to-[#3a86ff]
    group-hover/card:scale-110 transition-all duration-300 p-2"
              >
                <MessageCircle className="size-4 text-white" />
              </div>
              <span className="text-sm font-medium capitalize">
                Create New Chat
              </span>
            </div>
          </DialogTrigger>

          <FriendListModal />
        </Dialog>
      </Card>
    </div>
  );
};

export default CreateNewChat;
