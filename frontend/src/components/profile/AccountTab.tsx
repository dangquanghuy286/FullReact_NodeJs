import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/auth.store";

const useProfileSchema = () => {
  const { t } = useTranslation();

  return z.object({
    displayName: z.string().min(1, t("account.validation.displayNameRequired")),
    username: z.string().min(3, t("account.validation.usernameMin")),
    email: z.string().email(t("account.validation.emailInvalid")),
    phone: z.string().optional(),
    bio: z.string().max(160, t("account.validation.bioMax")).optional(),
  });
};

type ProfileFormData = {
  displayName: string;
  username: string;
  email: string;
  phone?: string;
  bio?: string;
};

export const AccountTab = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const profileSchema = useProfileSchema();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
      phone: "",
      bio: user?.bio ?? "",
    },
  });

  const onSaveProfile = async (data: ProfileFormData) => {
    console.log("Save profile", data);
    // TODO: call API
  };

  return (
    <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-[#00c0d1]">♡</span>
        <div>
          <p className="text-sm font-semibold">{t("account.title")}</p>
          <p className="text-xs text-muted-foreground">
            {t("account.subtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="displayName">{t("account.displayName")}</Label>
          <Input id="displayName" {...register("displayName")} />
          {errors.displayName && (
            <p className="text-destructive text-xs">
              {errors.displayName.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="username">{t("account.username")}</Label>
          <Input id="username" {...register("username")} />
          {errors.username && (
            <p className="text-destructive text-xs">
              {errors.username.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("account.email")}</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-destructive text-xs">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">{t("account.phone")}</Label>
          <Input id="phone" {...register("phone")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio">{t("account.bio")}</Label>
        <Textarea id="bio" rows={3} {...register("bio")} />
        {errors.bio && (
          <p className="text-destructive text-xs">{errors.bio.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={!isDirty}
        className="bg-gradient-to-r from-[#00c0d1] to-[#007a8a] hover:opacity-90"
      >
        {t("account.saveChanges")}
      </Button>
    </form>
  );
};
