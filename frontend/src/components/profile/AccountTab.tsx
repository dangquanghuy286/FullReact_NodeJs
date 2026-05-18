import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user.store";

const useProfileSchema = () => {
  const { t } = useTranslation();
  return z.object({
    displayName: z.string().min(1, t("account.validation.displayNameRequired")),
    phone: z.string().optional(),
    bio: z.string().max(160, t("account.validation.bioMax")).optional(),
  });
};

type ProfileFormData = {
  displayName: string;
  phone?: string;
  bio?: string;
};

export const AccountTab = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const profileSchema = useProfileSchema();
  const { updateProfile } = useUserStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName ?? "",
      phone: user?.phone ?? "",
      bio: user?.bio ?? "",
    },
  });

  const onSaveProfile = async (data: ProfileFormData) => {
    try {
      const res = await updateProfile(data);

      toast.success(res.message ?? t("account.saveSuccess"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("account.saveError"),
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-5">
      {/* Header */}
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
          <Label htmlFor="username" className="text-muted-foreground">
            {t("account.username")}
          </Label>
          <Input
            id="username"
            value={user?.username ?? ""}
            readOnly
            disabled
            className="opacity-50 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-muted-foreground">
            {t("account.email")}
          </Label>
          <Input
            id="email"
            type="email"
            value={user?.email ?? ""}
            readOnly
            disabled
            className="opacity-50 cursor-not-allowed"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">{t("account.phone")}</Label>
          <Input id="phone" {...register("phone")} />
        </div>
      </div>

      {/* Bio */}
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
