import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Step } from "../../../types/schemas";

function useSteps(): { key: Step; label: string }[] {
  const { t } = useTranslation();
  return [
    { key: "request", label: t("auth.forgotPassword.steps.account") },
    { key: "otp", label: t("auth.forgotPassword.steps.verify") },
    { key: "reset", label: t("auth.forgotPassword.steps.newPassword") },
  ];
}

export function StepIndicator({ current }: { current: Step }) {
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
