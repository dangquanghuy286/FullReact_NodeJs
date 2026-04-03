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
};
