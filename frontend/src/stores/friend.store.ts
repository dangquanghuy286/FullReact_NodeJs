import { friendService } from "@/services/friend.service";
import type { FriendState } from "@/types/store";
import { create } from "zustand";

export const useFriendStore = create<FriendState>((set, get) => ({
  loading: false,
  searchByUserName: async (username) => {
    try {
      set({ loading: true });
      const user = await friendService.searchByUserName(username);
      return user;
    } catch (error) {
      console.error("Error searching user:", error);
      return null;
    } finally {
      set({ loading: false });
    }
  },
  addFriend: async (to, message) => {
    try {
      set({ loading: true });
      const result = await friendService.sendFriendRequest(to, message);
      return result;
    } catch (error) {
      console.error("Error adding friend:", error);
      return null;
    } finally {
      set({ loading: false });
    }
  },
}));
