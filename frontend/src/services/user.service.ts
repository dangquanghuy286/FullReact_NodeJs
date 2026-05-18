import api from "@/lib/axios";

export const userService = {
  uploadAvatar: async (formData: FormData) => {
    const res = await api.post("/user/uploadAvatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status === 400) {
      throw new Error(res.data.message);
    }
    return res.data;
  },
  updateProfile: async (data: {
    displayName?: string;
    phone?: string;
    bio?: string;
  }) => {
    const res = await api.patch("/user/updateProfile", data);
    if (res.status === 400) {
      throw new Error(res.data.message);
    }
    return res.data;
  },
};
