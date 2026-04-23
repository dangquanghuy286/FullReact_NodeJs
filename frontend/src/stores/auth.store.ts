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
      loading: false, // Track loading state
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
          toast.success("Registration successful!");
        } catch (error) {
          console.error(error);
          toast.error("Registration failed!");
        } finally {
          set({
            loading: false,
          });
        }
      },
      signIn: async (username, password) => {
        try {
          get().clearState();
          set({ loading: true });
          localStorage.clear();
          useChatStore.getState().reset();
          const { accessToken } = await authService.signIn(username, password);
          set({ accessToken });
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
          set({
            loading: true,
          });
          // Call API
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
        try {
          const { user, getProfile } = get();
          const accessToken = await authService.refresh();
          set({ accessToken });
          if (!user) {
            await getProfile();
          }
        } catch (error) {
          console.error(error);
          toast.error("Your session has expired!");
          get().clearState();
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user, // Only persist user and accessToken, not loading to avoid stale state on page reload
        accessToken: state.accessToken,
      }),
    },
  ),
);
