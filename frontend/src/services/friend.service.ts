import api from "@/lib/axios";

export const friendService = {
  async searchByUserName(username: string) {
    const res = await api.get(`/user/search?username=${username}`);
    return res.data.user;
  },
  async sendFriendRequest(to: string, message?: string) {
    const res = await api.post("/friend/requests", { to, message });
    return res.data.message;
  },

  async getAllFriendRequests() {
    try {
      const res = await api.get("/friend/requests");
      const { sent, received } = res.data;
      return { sent, received };
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  },

  async acceptFriendRequest(requestId: string) {
    try {
      const res = await api.post(`/friend/requests/${requestId}/accept`);
      return res.data.requestAcceptedBy;
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  },

  async declineFriendRequest(requestId: string) {
    try {
      await api.post(`/friend/requests/${requestId}/decline`);
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  },

  async getFriends() {
    try {
      const res = await api.get("/friend");
      return res.data.friends;
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  },
};
