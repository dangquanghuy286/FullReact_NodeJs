import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { GoogleLogin } from "@react-oauth/google";

import { useTranslation } from "react-i18next";
import { PasswordInput } from "../input/PasswordInput";

import type { ApiErrorResponse } from "@/types/store";
import { toast } from "sonner";
import { RecoverAccountModal } from "../modal/RecoverAccountModal";

// Zod Schema
const loginSchema = z.object({
  username: z.string().min(1, "Please enter username"),
  password: z.string().min(1, "Please enter password"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signIn, googleSignIn } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Tài khoản bị khóa → mở modal nhập OTP khôi phục ngay trong form login
  const [recoverModalOpen, setRecoverModalOpen] = useState(false);
  const [recoverUsername, setRecoverUsername] = useState("");

  const onSubmit = async (data: LoginFormData) => {
    const { username, password } = data;
    try {
      await signIn(username, password);
      navigate("/");
    } catch (error) {
      const code = (error as ApiErrorResponse).response?.data?.code;

      if (code === "ACCOUNT_DEACTIVATED") {
        setRecoverUsername(username);
        setRecoverModalOpen(true);
        return;
      }

      // Login failed
      console.error("Login failed:", error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: {
    credential?: string;
  }) => {
    try {
      if (!credentialResponse.credential) return;
      await googleSignIn(credentialResponse.credential);
      navigate("/");
    } catch (error) {
      console.error(t("auth.login.googleFailed"), error);
    }
  };

  const handleRecovered = () => {
    toast.success(
      t(
        "auth.recoverAccount.pleaseSignInAgain",
        "Account restored. Please sign in again.",
      ),
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">{t("auth.login.title")}</h1>
                <p className="text-muted-foreground text-sm">
                  {t("auth.login.subtitle")}
                </p>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">{t("account.username")}</Label>
                <Input
                  id="username"
                  placeholder="username"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="error-message">{errors.username.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.login.password")}</Label>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="error-message">{errors.password.message}</p>
                )}

                {/* Forgot Password */}
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-muted-foreground underline hover:text-primary"
                  >
                    {t("auth.login.forgotPassword")}
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                {t("auth.login.submit")}
              </Button>

              {/* Separator */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t("auth.login.orContinueWith")}
                  </span>
                </div>
              </div>

              {/* Google Login */}
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.error(t("auth.login.googleFailed"))}
                />
              </div>

              {/* Footer */}
              <div className="text-center text-sm">
                {t("auth.login.noAccount")}{" "}
                <Link to="/signup" className="underline hover:text-primary">
                  {t("auth.login.createAccount")}
                </Link>
              </div>
            </div>
          </form>

          {/* Image Side */}
          <div
            className="bg-muted relative hidden md:block"
            style={{
              background:
                "radial-gradient(circle at center, #FFF991 0%, transparent 70%)",
            }}
          >
            <img
              src="./placeholder.png"
              alt="Login illustration"
              className="absolute inset-0 object-cover top-1/2 -translate-y-1/2"
            />
          </div>
        </CardContent>
      </Card>

      <RecoverAccountModal
        open={recoverModalOpen}
        username={recoverUsername}
        onOpenChange={setRecoverModalOpen}
        onRecovered={handleRecovered}
      />
    </div>
  );
}
