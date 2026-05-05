import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Bell, ShieldOff, Trash2, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const usePasswordSchema = () => {
  const { t } = useTranslation();

  return z
    .object({
      currentPassword: z
        .string()
        .min(1, t("security.validation.currentPasswordRequired")),
      newPassword: z.string().min(6, t("security.validation.newPasswordMin")),
      confirmPassword: z
        .string()
        .min(1, t("security.validation.confirmPasswordRequired")),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
      message: t("security.validation.confirmPasswordMismatch"),
      path: ["confirmPassword"],
    });
};

type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const SecurityTab = () => {
  const { t } = useTranslation();
  const passwordSchema = usePasswordSchema();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onChangePassword = async (data: PasswordFormData) => {
    console.log("Change password", data);
    reset();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <ShieldOff className="size-4 text-[#00c0d1]" />
        <div>
          <p className="text-sm font-semibold">{t("security.title")}</p>
          <p className="text-xs text-muted-foreground">
            {t("security.subtitle")}
          </p>
        </div>
      </div>

      {/* Change Password */}
      <form onSubmit={handleSubmit(onChangePassword)} className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Lock className="size-4" />
          {t("security.changePassword.label")}
        </div>

        {/* Current Password */}
        <div className="space-y-1.5">
          <Label>{t("security.changePassword.currentPassword")}</Label>
          <div className="relative">
            <Input
              type={showCurrent ? "text" : "password"}
              {...register("currentPassword")}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-destructive text-xs">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>{t("security.changePassword.newPassword")}</Label>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                {...register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-destructive text-xs">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>{t("security.changePassword.confirmPassword")}</Label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-destructive text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          variant="outline"
          className="border-[#00c0d1]/40 text-[#00a0b0]"
        >
          {t("security.changePassword.submit")}
        </Button>
      </form>

      <Separator />

      <button className="w-full flex items-center gap-3  text-sm hover:text-[#00a0b0] transition-colors group">
        <Bell className="size-4 group-hover:text-[#00c0d1]" />
        {t("security.notificationSettings")}
      </button>

      <Separator />

      <button className="w-full flex items-center gap-3  text-sm hover:text-[#00a0b0] transition-colors group">
        <ShieldOff className="size-4 group-hover:text-[#00c0d1]" />
        {t("security.blockReport")}
      </button>

      <Separator />

      {/* Danger Zone */}
      <div className="pt-2">
        <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-2">
          {t("security.dangerZone.label")}
        </p>
        <Button variant="destructive" className="w-full gap-2">
          <Trash2 className="size-4" />
          {t("security.dangerZone.deleteAccount")}
        </Button>
      </div>
    </div>
  );
};
