import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { useTranslation } from "react-i18next";
import { StepIndicator } from "./StepIndicator";
import { RequestStep } from "./steps/requeststep";
import { OtpStep } from "./steps/otpstep";
import { ResetStep } from "./steps/resetstep";
import { DoneStep } from "./steps/donestep";
import type {
  OtpFormData,
  RequestFormData,
  ResetFormData,
  Step,
} from "@/types/schemas";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { forgotSendOTP, forgotVerifyOTP, forgotResetPassword } =
    useAuthStore();
  const { t } = useTranslation();

  const [step, setStep] = useState<Step>("request");
  const [identifier, setIdentifier] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

              {step === "request" && (
                <RequestStep
                  isSubmitting={isSubmitting}
                  onSubmit={onSubmitRequest}
                />
              )}

              {step === "otp" && (
                <OtpStep
                  identifier={identifier}
                  isSubmitting={isSubmitting}
                  onSubmit={onSubmitOtp}
                  onResend={handleResendOtp}
                  onUseDifferentAccount={() => setStep("request")}
                />
              )}

              {step === "reset" && (
                <ResetStep
                  isSubmitting={isSubmitting}
                  onSubmit={onSubmitReset}
                />
              )}

              {step === "done" && <DoneStep />}

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
