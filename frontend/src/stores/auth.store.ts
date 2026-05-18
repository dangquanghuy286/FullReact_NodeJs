import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import type { AuthState } from "@/types/store";
import { persist } from "zustand/middleware";
import { useChatStore } from "./chat.store";

// Store Auth
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,
      isRefreshing: false,
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
          set({ loading: true });
          await authService.signUp(
            username,
            password,
            email,
            firstName,
            lastName,
          );
          toast.success("Registration successful!");
        } catch (error) {
          console.error(error);
          toast.error("Registration failed!");
        } finally {
          set({ loading: false });
        }
      },
      signIn: async (username, password) => {
        try {
          set({ loading: true });
          const { accessToken } = await authService.signIn(username, password);
          set({ accessToken, user: null });
          useChatStore.getState().reset();
          await get().getProfile();
          useChatStore.getState().fetchConversations();
          toast.success("Signed in successfully! Welcome back!");
        } catch (error) {
          toast.error("Sign in failed!");
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      signOut: async () => {
        try {
          get().clearState();
          await authService.signOut();
          toast.success("Logged out successfully");
        } catch (error) {
          console.error(error);
          toast.error("An error occurred while logging out!");
        }
      },
      getProfile: async () => {
        try {
          set({ loading: true });
          const user = await authService.getProfile();
          set({ user });
        } catch (error) {
          console.error(error);
          set({ user: null, accessToken: null });
          toast.error("An error occurred while fetching profile!");
        } finally {
          set({ loading: false });
        }
      },
      refresh: async () => {
        // Nếu đang refresh, chờ token mới thay vì return undefined
        if (get().isRefreshing) {
          return new Promise<string>((resolve) => {
            const unsub = useAuthStore.subscribe((state) => {
              if (!state.isRefreshing && state.accessToken) {
                unsub();
                resolve(state.accessToken);
              }
            });
          });
        }

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
          toast.error("Your session has expired!");
          set({ accessToken: null, user: null });
          throw error;
        } finally {
          set({ loading: false, isRefreshing: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    },
  ),
);
