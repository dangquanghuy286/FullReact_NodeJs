import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth.store";
import { ShieldOff } from "lucide-react";

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain digits only"),
});

type OTPFormData = z.infer<typeof otpSchema>;

const RESEND_COOLDOWN_SECONDS = 30;

interface RecoverAccountModalProps {
  open: boolean;
  username: string;
  onOpenChange: (open: boolean) => void;
  onRecovered: () => void;
}

export function RecoverAccountModal({
  open,
  username,
  onOpenChange,
  onRecovered,
}: RecoverAccountModalProps) {
  const { t } = useTranslation();
  const { recoverVerifyOTP, recoverResendOTP, recoverLoading } = useAuthStore();
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onSubmit = async (data: OTPFormData) => {
    try {
      await recoverVerifyOTP({ username, otp: data.otp });
      reset();
      onOpenChange(false);
      onRecovered();
    } catch {
      // Lỗi đã được toast trong store
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await recoverResendOTP({ username });
      startCooldown();
    } catch {
      // Lỗi đã được toast trong store
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ShieldOff className="size-5 text-[#00c0d1]" />
            <DialogTitle>
              {t("auth.recoverAccount.title", "Account locked")}
            </DialogTitle>
          </div>
          <DialogDescription>
            {t(
              "auth.recoverAccount.subtitle",
              "Your account is deactivated. Enter the OTP we sent to your registered email to restore access.",
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="recover-otp">
              {t("auth.recoverAccount.otpLabel", "OTP code")}
            </Label>
            <Input
              id="recover-otp"
              inputMode="numeric"
              maxLength={6}
              placeholder="••••••"
              autoFocus
              {...register("otp")}
            />
            {errors.otp && (
              <p className="error-message text-destructive text-xs">
                {errors.otp.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={recoverLoading}>
            {recoverLoading
              ? t("auth.recoverAccount.verifying", "Verifying...")
              : t("auth.recoverAccount.submit", "Verify & unlock account")}
          </Button>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || recoverLoading}
              className="text-muted-foreground underline hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
            >
              {cooldown > 0
                ? t("auth.recoverAccount.resendCooldown", {
                    seconds: cooldown,
                    defaultValue: `Resend OTP in ${cooldown}s`,
                  })
                : t("auth.recoverAccount.resend", "Resend OTP")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
