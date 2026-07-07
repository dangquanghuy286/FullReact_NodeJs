import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { resetSchema, type ResetFormData } from "../../../../types/schemas";
import { PasswordInput } from "@/components/input/PasswordInput";

interface ResetStepProps {
  isSubmitting: boolean;
  onSubmit: (data: ResetFormData) => Promise<void> | void;
}

export function ResetStep({ isSubmitting, onSubmit }: ResetStepProps) {
  const { t } = useTranslation();
  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  return (
    <form
      onSubmit={resetForm.handleSubmit(onSubmit)}
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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting
          ? t("auth.forgotPassword.resetting")
          : t("auth.forgotPassword.resetSubmit")}
      </Button>
    </form>
  );
}
