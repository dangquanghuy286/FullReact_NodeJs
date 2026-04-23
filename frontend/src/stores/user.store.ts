import type { UserState } from "@/types/store";
import { create } from "zustand";
import { useAuthStore } from "./auth.store";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import { useChatStore } from "./chat.store";

export const useUserStore = create<UserState>(() => ({
  updateAvatarUrl: async (formData: FormData) => {
    try {
      const { user, setUser } = useAuthStore.getState();

      const data = await userService.uploadAvatar(formData);

      if (user) {
        setUser({
          ...user,
          avatarURL: data.avatarURL,
        });
        useChatStore.getState().fetchConversations();
      }
      toast.success("Avatar uploaded successfully 🎉");
      return data;
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Avatar upload failed");
      throw error;
    }
  },
}));
