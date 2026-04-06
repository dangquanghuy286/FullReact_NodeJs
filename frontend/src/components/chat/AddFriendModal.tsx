import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { UserPlus } from "lucide-react";

export interface IFormValues {
  username: string;
  message: string;
}

const AddFriendModal = () => {
  const [isFound, setIsFound] = useState<boolean | null>(null);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex justify-center items-center size-5 rounded-full hover:bg-[#e2e8f0] cursor-pointer z-10">
            <UserPlus className="size-4 " />
            <span className="sr-only">Add Friend</span>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] border-none">
          <DialogHeader>
            <DialogTitle>Add Friend</DialogTitle>
          </DialogHeader>

          {!isFound && <>{/* Todo:form search by username */}</>}

          {isFound && <>{/* Todo:Form send friend request */}</>}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddFriendModal;
