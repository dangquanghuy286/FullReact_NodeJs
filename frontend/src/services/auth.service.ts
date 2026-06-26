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

  // ─────────────────────────────────────────────
  // Forgot Password
  // ─────────────────────────────────────────────
  forgotSendOTP: async (payload: { email?: string; username?: string }) => {
    const res = await api.post("/auth/forgot-password/send-otp", payload, {
      withCredentials: true,
    });
    return res.data;
  },

  forgotVerifyOTP: async (payload: {
    email?: string;
    username?: string;
    otp: string;
  }) => {
    const res = await api.post("/auth/forgot-password/verify-otp", payload, {
      withCredentials: true,
    });
    // res.data = { message, resetToken }
    return res.data;
  },

  forgotResetPassword: async (resetToken: string, newPassword: string) => {
    const res = await api.post(
      "/auth/forgot-password/reset-password",
      { newPassword },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${resetToken}`,
        },
      },
    );
    return res.data;
  },

  // ─────────────────────────────────────────────
  // Recover Account (tài khoản bị tự khóa / deactivate)
  // ─────────────────────────────────────────────
  recoverVerifyOTP: async (payload: { username: string; otp: string }) => {
    const res = await api.post("/auth/recover-account/verify-otp", payload, {
      withCredentials: true,
    });
    return res.data;
  },

  recoverResendOTP: async (payload: { username: string }) => {
    const res = await api.post("/auth/recover-account/resend-otp", payload, {
      withCredentials: true,
    });
    return res.data;
  },

  // ─────────────────────────────────────────────
  // Deactivate Account
  // ─────────────────────────────────────────────
  deactivateAccount: async (password: string) => {
    const res = await api.patch(
      "/auth/deactivate-account",
      { password },
      { withCredentials: true },
    );
    return res.data;
  },
};
