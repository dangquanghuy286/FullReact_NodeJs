import api from "@/lib/axios";
import axios from "axios";

export const authService = {
  signUp: async (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => {
    const res = await api.post(
      "/auth/signup",
      {
        username,
        password,
        email,
        firstName,
        lastName,
      },
      { withCredentials: true },
    );
    return res.data;
  },

  signIn: async (username: string, password: string) => {
    const res = await api.post(
      "/auth/signin",
      {
        username,
        password,
      },
      { withCredentials: true },
    );
    return res.data;
  },

  googleSignIn: async (idToken: string) => {
    const res = await api.post(
      "/auth/googlesignin",
      { idToken },
      { withCredentials: true },
    );
    return res.data;
  },

  signOut: async () => {
    return api.post("/auth/signout", {}, { withCredentials: true });
  },

  getProfile: async () => {
    const res = await api.get("/user/profile", { withCredentials: true });
    return res.data.user;
  },

  refresh: async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/auth/refresh`,
      { withCredentials: true },
    );
    return res.data.accessToken;
  },
};
