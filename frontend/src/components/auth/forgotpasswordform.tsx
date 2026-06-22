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
import { useTranslation } from "react-i18next";
import { PasswordInput } from "../input/PasswordInput";

// ─────────────────────────────────────────────
// Step 1: Nhập email hoặc username
// ─────────────────────────────────────────────
const requestSchema = z.object({
  identifier: z.string().min(1, "Please enter your email or username"),
});
type RequestFormData = z.infer<typeof requestSchema>;

// ─────────────────────────────────────────────
// Step 2: Nhập OTP
// ─────────────────────────────────────────────
const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});
type OtpFormData = z.infer<typeof otpSchema>;

// ─────────────────────────────────────────────
// Step 3: Đặt mật khẩu mới
// ─────────────────────────────────────────────
const resetSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).+$/,
        "Password must contain both letters and numbers",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type ResetFormData = z.infer<typeof resetSchema>;

type Step = "request" | "otp" | "reset" | "done";

function useSteps(): { key: Step; label: string }[] {
  const { t } = useTranslation();
  return [
    { key: "request", label: t("auth.forgotPassword.steps.account") },
    { key: "otp", label: t("auth.forgotPassword.steps.verify") },
    { key: "reset", label: t("auth.forgotPassword.steps.newPassword") },
  ];
}

function StepIndicator({ current }: { current: Step }) {
  const steps = useSteps();
  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center justify-center gap-2 mb-2">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={step.key} className="flex items-center">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium border transition-colors",
                isCompleted &&
                  "bg-primary text-primary-foreground border-primary",
                isActive && !isCompleted && "border-primary text-primary",
                !isActive &&
                  !isCompleted &&
                  "border-muted-foreground/30 text-muted-foreground",
              )}
            >
              {isCompleted ? "✓" : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-px w-8 mx-1",
                  isCompleted ? "bg-primary" : "bg-muted-foreground/30",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { forgotSendOTP, forgotVerifyOTP, forgotResetPassword } =
    useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [step, setStep] = useState<Step>("request");
  const [identifier, setIdentifier] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Step 1 form ──
  const requestForm = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  });

  const onSubmitRequest = async (data: RequestFormData) => {
    setIsSubmitting(true);
    try {
      const isEmail = data.identifier.includes("@");
      await forgotSendOTP(
        isEmail ? { email: data.identifier } : { username: data.identifier },
      );
      setIdentifier(data.identifier);
      setStep("otp");
    } catch (error) {
      // Lỗi đã được toast trong store
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step 2 form ──
  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmitOtp = async (data: OtpFormData) => {
    setIsSubmitting(true);
    try {
      const isEmail = identifier.includes("@");
      const payload = isEmail
        ? { email: identifier, otp: data.otp }
        : { username: identifier, otp: data.otp };

      const token = await forgotVerifyOTP(payload);
      setResetToken(token);
      setStep("reset");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setIsSubmitting(true);
    try {
      const isEmail = identifier.includes("@");
      await forgotSendOTP(
        isEmail ? { email: identifier } : { username: identifier },
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step 3 form ──
  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmitReset = async (data: ResetFormData) => {
    setIsSubmitting(true);
    try {
      await forgotResetPassword(resetToken, data.newPassword);
      setStep("done");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  {t("auth.forgotPassword.title")}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {step === "request" &&
                    t("auth.forgotPassword.subtitleRequest")}
                  {step === "otp" && t("auth.forgotPassword.subtitleOtp")}
                  {step === "reset" && t("auth.forgotPassword.subtitleReset")}
                  {step === "done" && t("auth.forgotPassword.subtitleDone")}
                </p>
              </div>

              {/* Step indicator */}
              {step !== "done" && <StepIndicator current={step} />}

              {/* ── STEP 1: Request OTP ── */}
              {step === "request" && (
                <form
                  onSubmit={requestForm.handleSubmit(onSubmitRequest)}
                  className="flex flex-col gap-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="identifier">
                      {t("auth.forgotPassword.identifier")}
                    </Label>
                    <Input
                      id="identifier"
                      placeholder={t(
                        "auth.forgotPassword.identifierPlaceholder",
                      )}
                      {...requestForm.register("identifier")}
                    />
                    {requestForm.formState.errors.identifier && (
                      <p className="error-message">
                        {requestForm.formState.errors.identifier.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? t("auth.forgotPassword.sending")
                      : t("auth.forgotPassword.sendOtp")}
                  </Button>
                </form>
              )}

              {/* ── STEP 2: Verify OTP ── */}
              {step === "otp" && (
                <form
                  onSubmit={otpForm.handleSubmit(onSubmitOtp)}
                  className="flex flex-col gap-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="otp">
                      {t("auth.forgotPassword.otpCode")}
                    </Label>
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

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? t("auth.forgotPassword.verifying")
                      : t("auth.forgotPassword.verifyOtp")}
                  </Button>

                  <div className="text-center text-sm">
                    {t("auth.forgotPassword.resendPrompt")}{" "}
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isSubmitting}
                      className="underline hover:text-primary disabled:opacity-50"
                    >
                      {t("auth.forgotPassword.resendOtp")}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep("request")}
                    className="text-center text-sm text-muted-foreground underline hover:text-primary"
                  >
                    {t("auth.forgotPassword.useDifferentAccount")}
                  </button>
                </form>
              )}

              {/* ── STEP 3: Reset password ── */}
              {step === "reset" && (
                <form
                  onSubmit={resetForm.handleSubmit(onSubmitReset)}
                  className="flex flex-col gap-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">
                      {t("auth.forgotPassword.newPassword")}
                    </Label>
                    <PasswordInput
                      id="newPassword"
                      placeholder="••••••••"
                      {...resetForm.register("newPassword")}
                    />
                    {resetForm.formState.errors.newPassword && (
                      <p className="error-message">
                        {resetForm.formState.errors.newPassword.message}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {t("auth.forgotPassword.passwordHint")}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      {t("auth.forgotPassword.confirmPassword")}
                    </Label>
                    <PasswordInput
                      id="confirmPassword"
                      placeholder="••••••••"
                      {...resetForm.register("confirmPassword")}
                    />
                    {resetForm.formState.errors.confirmPassword && (
                      <p className="error-message">
                        {resetForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? t("auth.forgotPassword.resetting")
                      : t("auth.forgotPassword.resetSubmit")}
                  </Button>
                </form>
              )}

              {/* ── STEP 4: Done ── */}
              {step === "done" && (
                <div className="flex flex-col gap-6">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                    <p className="text-sm text-green-700">
                      {t("auth.forgotPassword.doneMessage")}
                    </p>
                  </div>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => navigate("/signin")}
                  >
                    {t("auth.forgotPassword.goToSignIn")}
                  </Button>
                </div>
              )}

              {/* Footer */}
              {step !== "done" && (
                <div className="text-center text-sm">
                  {t("auth.forgotPassword.rememberPassword")}{" "}
                  <Link to="/signin" className="underline hover:text-primary">
                    {t("auth.forgotPassword.signIn")}
                  </Link>
                </div>
              )}
            </div>
          </div>

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
              alt="Forgot password illustration"
              className="absolute inset-0 object-cover top-1/2 -translate-y-1/2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
