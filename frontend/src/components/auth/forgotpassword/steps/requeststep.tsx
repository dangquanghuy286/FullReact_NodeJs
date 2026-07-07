import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestSchema, type RequestFormData } from "../../../../types/schemas";

interface RequestStepProps {
  isSubmitting: boolean;
  onSubmit: (data: RequestFormData) => Promise<void> | void;
}

export function RequestStep({ isSubmitting, onSubmit }: RequestStepProps) {
  const { t } = useTranslation();
  const requestForm = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  });

  return (
    <form
      onSubmit={requestForm.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <div className="space-y-2">
        <Label htmlFor="identifier">
          {t("auth.forgotPassword.identifier")}
        </Label>
        <Input
          id="identifier"
          placeholder={t("auth.forgotPassword.identifierPlaceholder")}
          {...requestForm.register("identifier")}
        />
        {requestForm.formState.errors.identifier && (
          <p className="error-message">
            {requestForm.formState.errors.identifier.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting
          ? t("auth.forgotPassword.sending")
          : t("auth.forgotPassword.sendOtp")}
      </Button>
    </form>
  );
}
