import { create } from "zustand";
import { toast } from "sonner";
import i18next from "i18next";
import { authService } from "@/services/auth.service";
import type { ApiErrorResponse, AuthState } from "@/types/store";
import { persist } from "zustand/middleware";
import { useChatStore } from "./chat.store";

// Store Auth
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false, // Track loading state
      isRefreshing: false,
      recoverLoading: false,
      setAccessToken: (accessToken) => {
        set({ accessToken });
      },
      setUser: (user) => {
        set({ user });
      },
      // Reset state
      clearState: () => {
        set({
          accessToken: null,
          user: null,
          loading: false,
          isRefreshing: false,
        });
        useChatStore.getState().reset();
        localStorage.clear();
        sessionStorage.clear();
      },
      signUp: async (username, password, email, firstName, lastName) => {
        try {
          set({
            loading: true,
          });
          // Call API
          await authService.signUp(
            username,
            password,
            email,
            firstName,
            lastName,
          );
          toast.success(i18next.t("auth.signup.success"));
        } catch (error) {
          console.error(error);
          toast.error(i18next.t("auth.signup.failed"));
        } finally {
          set({
            loading: false,
          });
        }
      },
      signIn: async (username, password) => {
        try {
          set({ loading: true });
          const { accessToken } = await authService.signIn(username, password);
          // Set token TRƯỚC, rồi mới clear các thứ khác
          set({ accessToken, user: null });
          useChatStore.getState().reset();
          await get().getProfile();
          useChatStore.getState().fetchConversations();
          toast.success(i18next.t("auth.login.success"));
        } catch (error) {
          const code = (error as ApiErrorResponse).response?.data?.code;
          // Tài khoản bị khóa
          if (code !== "ACCOUNT_DEACTIVATED") {
            toast.error(i18next.t("auth.login.failed"));
          }
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      googleSignIn: async (idToken) => {
        try {
          set({ loading: true });
          const { accessToken } = await authService.googleSignIn(idToken);
          // Set token TRƯỚC, rồi mới clear các thứ khác (giống signIn)
          set({ accessToken, user: null });
          useChatStore.getState().reset();
          await get().getProfile();
          useChatStore.getState().fetchConversations();
          toast.success(i18next.t("auth.googleSuccess"));
        } catch (error) {
          toast.error(i18next.t("auth.googleFailed"));
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      signOut: async () => {
        try {
          get().clearState();
          await authService.signOut();
          toast.success(i18next.t("auth.logout.announcement"));
        } catch (error) {
          console.error(error);
          toast.error(i18next.t("auth.logout.failed"));
        }
      },
      getProfile: async () => {
        try {
          set({
            loading: true,
          });
          // Call API
          const user = await authService.getProfile();
          set({ user });
        } catch (error) {
          console.error(error);
          set({ user: null, accessToken: null });
          toast.error(i18next.t("auth.account.fetchError"));
        } finally {
          set({ loading: false });
        }
      },
      refresh: async () => {
        // Chặn gọi lại nếu đang refresh
        if (get().isRefreshing) return;
        try {
          set({ isRefreshing: true });
          const { user, getProfile } = get();
          const accessToken = await authService.refresh();
          set({ accessToken });
          if (!user) {
            await getProfile();
          }
          return accessToken;
        } catch (error) {
          console.error(error);
          toast.error(i18next.t("auth.session.expired"));
          // Không gọi clearState() để tránh loop — chỉ xóa token
          set({ accessToken: null, user: null });
        } finally {
          set({ loading: false, isRefreshing: false });
        }
      },
      // ─────────────────────────────────────────────
      // Forgot Password
      // ─────────────────────────────────────────────
      forgotSendOTP: async (payload) => {
        try {
          set({ loading: true });
          const { message } = await authService.forgotSendOTP(payload);
          toast.success(message || "OTP sent! Please check your email.");
        } catch (error) {
          console.error(error);
          toast.error("Could not send OTP. Please try again.");
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      forgotVerifyOTP: async (payload) => {
        try {
          set({ loading: true });
          const { resetToken } = await authService.forgotVerifyOTP(payload);
          toast.success("OTP verified successfully!");
          return resetToken;
        } catch (error) {
          console.error(error);
          toast.error("Invalid or expired OTP.");
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      forgotResetPassword: async (resetToken, newPassword) => {
        try {
          set({ loading: true });
          const { message } = await authService.forgotResetPassword(
            resetToken,
            newPassword,
          );
          toast.success(message || "Password reset successfully!");
        } catch (error) {
          console.error(error);
          toast.error("Could not reset password. Please try again.");
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      // ─────────────────────────────────────────────
      // Recover Account (tài khoản bị tự khóa / deactivate)
      // ─────────────────────────────────────────────
      recoverVerifyOTP: async (payload) => {
        try {
          set({ recoverLoading: true });
          const { message } = await authService.recoverVerifyOTP(payload);
          toast.success(message || "Account recovered! Please sign in again.");
        } catch (error) {
          const apiMessage = (error as ApiErrorResponse).response?.data
            ?.message;
          toast.error(apiMessage || "Could not verify OTP. Please try again.");
          throw error;
        } finally {
          set({ recoverLoading: false });
        }
      },
      recoverResendOTP: async (payload) => {
        try {
          set({ recoverLoading: true });
          const { message } = await authService.recoverResendOTP(payload);
          toast.success(message || "OTP sent! Please check your email.");
        } catch (error) {
          const apiMessage = (error as ApiErrorResponse).response?.data
            ?.message;
          toast.error(apiMessage || "Could not resend OTP. Please try again.");
          throw error;
        } finally {
          set({ recoverLoading: false });
        }
      },
      // ─────────────────────────────────────────────
      // Deactivate Account
      // ─────────────────────────────────────────────
      deactivateLoading: false,
      deactivateAccount: async (password) => {
        try {
          set({ deactivateLoading: true });
          const { message } = await authService.deactivateAccount(password);
          // Backend đã xóa session + clear cookie refreshToken rồi, nên ở
          // đây chỉ cần dọn state phía client, không cần gọi lại /auth/signout.
          get().clearState();
          toast.success(message || "Account deactivated.");
        } catch (error) {
          const apiMessage = (error as ApiErrorResponse).response?.data
            ?.message;
          toast.error(
            apiMessage || "Could not deactivate account. Please try again.",
          );
          throw error;
        } finally {
          set({ deactivateLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user, // Only persist user and accessToken, not loading to avoid stale state on page reload
        accessToken: state.accessToken,
        // isRefreshing và recoverLoading KHÔNG persist để tránh stale state
      }),
    },
  ),
);
