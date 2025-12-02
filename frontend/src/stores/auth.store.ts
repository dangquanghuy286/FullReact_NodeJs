import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false, //Theo doi trang thai

  signUp: async (username, password, email, firstName, lastName) => {
    try {
      set({
        loading: true,
      });
      // Goi API
      await authService.signUp(username, password, email, firstName, lastName);
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
}));
