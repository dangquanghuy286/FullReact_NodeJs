import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { UserPlus } from "lucide-react";

import { useFriendStore } from "@/stores/friend.store";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SearchForm from "../AddFriendModal/SearchForm";
import SendFriendRequestForm from "../AddFriendModal/SendFriendRequestForm";
import type { User } from "@/types/user";

export interface IFormValues {
  username: string;
  message: string;
}

const AddFriendModal = () => {
  const [isFound, setIsFound] = useState<boolean | null>(null);
  const [searchUser, setSearchUser] = useState<User>();
  const [searchedUsername, setSearchedUsername] = useState("");
  const { loading, searchByUserName, addFriend } = useFriendStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<IFormValues>({
    defaultValues: {
      username: "",
      message: "",
    },
  });

  const usernameValue = watch("username"); //Hàm watch để theo dõi giá trị của trường username luôn được cập nhật khi người dùng nhập liệu

  const handleSearch = handleSubmit(async (data) => {
    const username = data.username.trim();
    if (!username) {
      return;
    }

    setIsFound(null);
    setSearchedUsername(username);

    try {
      const foundUser = await searchByUserName(username);
      if (foundUser) {
        setIsFound(true);
        setSearchUser(foundUser);
      } else {
        setIsFound(false);
      }
    } catch (error) {
      console.error("Error searching user:", error);
      setIsFound(false);
    }
  });

  const handleSendRequest = handleSubmit(async (data) => {
    if (!searchUser) return;

    try {
      const message = await addFriend(searchUser._id, data.message.trim());

      toast.success(message);
      handleBack();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send friend request",
      );
    }
  });

  const handleBack = () => {
    reset();
    setIsFound(null);
    setSearchUser(undefined);
    setSearchedUsername("");
  };
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

          {!isFound && (
            <>
              <SearchForm
                register={register}
                errors={errors}
                usernameValue={usernameValue}
                loading={loading}
                isFound={isFound}
                searchedUsername={searchedUsername}
                onSubmit={handleSearch}
                onCancel={handleBack}
              />
            </>
          )}

          {isFound && (
            <>
              <SendFriendRequestForm
                register={register}
                loading={loading}
                searchedUsername={searchedUsername}
                onSubmit={handleSendRequest}
                onBack={handleBack}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddFriendModal;
