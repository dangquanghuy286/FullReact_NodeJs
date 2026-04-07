import { friendService } from "@/services/friend.service";
import type { FriendState } from "@/types/store";
import { create } from "zustand";
//  Store for managing friend-related state and actions
export const useFriendStore = create<FriendState>((set, get) => ({
  loading: false,
  receivedList: [],
  sentList: [],

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
  getAllFriendRequests: async () => {
    try {
      set({ loading: true });
      const result = await friendService.getAllFriendRequests();
      if (!result) return;
      const { sent, received } = result;

      set({ sentList: sent, receivedList: received });
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      set({ loading: false });
    }
  },
  acceptFriendRequest: async (requestId) => {
    try {
      set({ loading: true });

      await friendService.acceptFriendRequest(requestId);

      set((state) => ({
        receivedList: state.receivedList.filter((req) => req._id !== requestId),
      }));
    } catch (error) {
      console.error("Error accepting friend request:", error);
    } finally {
      set({ loading: false });
    }
  },
  declineFriendRequest: async (requestId) => {
    try {
      set({ loading: true });

      await friendService.declineFriendRequest(requestId);

      set((state) => ({
        receivedList: state.receivedList.filter((req) => req._id !== requestId),
      }));
    } catch (error) {
      console.error("Error declining friend request:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
