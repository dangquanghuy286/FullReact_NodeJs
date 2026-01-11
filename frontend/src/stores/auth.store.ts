import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import type { AuthState } from "@/types/store";
import { persist } from "zustand/middleware";
import { useChatStore } from "./chat.store";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false, //Theo doi trang thai
      // Reset state
      clearState: () => {
        set({
          accessToken: null,
          user: null,
          loading: false,
        });
        localStorage.clear();
        useChatStore.getState().reset();
      },
      signUp: async (username, password, email, firstName, lastName) => {
        try {
          set({
            loading: true,
          });
          // Goi API
          await authService.signUp(
            username,
            password,
            email,
            firstName,
            lastName
          );
          toast.success("Đăng ký thành công ! ");
        } catch (error) {
          console.error(error);
          toast.error("Đăng ký không thành công !");
        } finally {
          set({
            loading: false,
          });
        }
      },
      signIn: async (username, password) => {
        try {
          set({ loading: true });
          localStorage.clear();
          useChatStore.getState().reset();
          const { accessToken } = await authService.signIn(username, password);
          set({ accessToken });
          await get().getProfile();
          useChatStore.getState().fetchConversations();
          toast.success("Đăng nhập thành công! Chào mừng bạn quay trở lại!");
        } catch (error) {
          toast.error("Đăng nhập thất bại!");
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      signOut: async () => {
        try {
          get().clearState();
          await authService.signOut();
          toast.success("Logout Thành Công");
        } catch (error) {
          console.error(error);
          toast.error("Lỗi xảy ra khi logout!");
        }
      },
      getProfile: async () => {
        try {
          set({
            loading: true,
          });
          // Goi api
          const user = await authService.getProfile();
          set({ user });
        } catch (error) {
          console.error(error);
          set({ user: null, accessToken: null });
          toast.error("Lỗi xảy ra khi logout!");
        } finally {
          set({ loading: false });
        }
      },
      refresh: async () => {
        try {
          const { user, getProfile } = get();
          const accessToken = await authService.refresh();
          set({ accessToken });
          if (!user) {
            await getProfile();
          }
        } catch (error) {
          console.error(error);
          toast.error("Phiên đăng nhập đã hết hạn !");
          get().clearState();
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user, // Chi luu thong tin user
      }),
    }
  )
);
