import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { otpSchema, type OtpFormData } from "../../../../types/schemas";

interface OtpStepProps {
  identifier: string;
  isSubmitting: boolean;
  onSubmit: (data: OtpFormData) => Promise<void> | void;
  onResend: () => Promise<void> | void;
  onUseDifferentAccount: () => void;
}

export function OtpStep({
  identifier,
  isSubmitting,
  onSubmit,
  onResend,
  onUseDifferentAccount,
}: OtpStepProps) {
  const { t } = useTranslation();
  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  return (
    <form
      onSubmit={otpForm.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <div className="space-y-2">
        <Label htmlFor="otp">{t("auth.forgotPassword.otpCode")}</Label>
        <Input
          id="otp"
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          className="text-center text-lg tracking-widest"
          {...otpForm.register("otp")}
        />
        {otpForm.formState.errors.otp && (
          <p className="error-message">
            {otpForm.formState.errors.otp.message}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          {t("auth.forgotPassword.otpSentTo")}{" "}
          <span className="font-medium">{identifier}</span>.{" "}
          {t("auth.forgotPassword.otpExpiry")}
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting
          ? t("auth.forgotPassword.verifying")
          : t("auth.forgotPassword.verifyOtp")}
      </Button>

      <div className="text-center text-sm">
        {t("auth.forgotPassword.resendPrompt")}{" "}
        <button
          type="button"
          onClick={onResend}
          disabled={isSubmitting}
          className="underline hover:text-primary disabled:opacity-50"
        >
          {t("auth.forgotPassword.resendOtp")}
        </button>
      </div>

      <button
        type="button"
        onClick={onUseDifferentAccount}
        className="text-center text-sm text-muted-foreground underline hover:text-primary"
      >
        {t("auth.forgotPassword.useDifferentAccount")}
      </button>
    </form>
  );
}
