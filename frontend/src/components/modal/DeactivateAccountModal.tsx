import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth.store";
import { PasswordInput } from "@/components/input/PasswordInput";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const deactivateSchema = z.object({
  password: z.string().min(1, "Please enter your password"),
});

type DeactivateFormData = z.infer<typeof deactivateSchema>;

interface DeactivateAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeactivateAccountModal({
  open,
  onOpenChange,
}: DeactivateAccountModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deactivateAccount, deactivateLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeactivateFormData>({
    resolver: zodResolver(deactivateSchema),
  });

  const onSubmit = async (data: DeactivateFormData) => {
    try {
      await deactivateAccount(data.password);
      reset();
      onOpenChange(false);
      toast.success(t("security.dangerZone.deactivateSuccess"));
      navigate("/signin");
    } catch {
      // Lỗi đã được toast trong store (ví dụ: sai mật khẩu)
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
            <Trash2 className="size-5 text-destructive" />
            <DialogTitle>
              {t("security.dangerZone.deactivateAccount")}
            </DialogTitle>
          </div>
          <DialogDescription>
            {t("security.dangerZone.deactivateDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="deactivate-password">
              {t("security.dangerZone.confirmPassword")}
            </Label>
            <PasswordInput
              id="deactivate-password"
              autoFocus
              {...register("password")}
            />
            {errors.password && (
              <p className="text-destructive text-xs">
                {errors.password.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={deactivateLoading}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={deactivateLoading}
            >
              {deactivateLoading
                ? t("security.dangerZone.deactivating", "Deactivating...")
                : t("security.dangerZone.deactivateAccount")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
