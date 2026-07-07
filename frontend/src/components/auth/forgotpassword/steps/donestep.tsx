import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function DoneStep() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
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
  );
}
