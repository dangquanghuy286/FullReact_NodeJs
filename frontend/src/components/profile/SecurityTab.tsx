import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Bell, ShieldOff, Trash2, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter current password"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Password confirmation does not match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export const SecurityTab = () => {
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
          <p className="text-sm font-semibold">Privacy & Security</p>
          <p className="text-xs text-muted-foreground">
            Manage your privacy and security settings
          </p>
        </div>
      </div>

      {/* Change Password */}
      <form onSubmit={handleSubmit(onChangePassword)} className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Lock className="size-4" />
          Change Password
        </div>

        {/* Current Password */}
        <div className="space-y-1.5">
          <Label>Current Password</Label>
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
            <Label>New Password</Label>
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
            <Label>Confirm Password</Label>
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
          Update Password
        </Button>
      </form>

      <Separator />

      <button className="w-full flex items-center gap-3 py-2 text-sm hover:text-[#00a0b0] transition-colors group">
        <Bell className="size-4 group-hover:text-[#00c0d1]" />
        Notification Settings
      </button>

      <Separator />

      <button className="w-full flex items-center gap-3 py-2 text-sm hover:text-[#00a0b0] transition-colors group">
        <ShieldOff className="size-4 group-hover:text-[#00c0d1]" />
        Block & Report
      </button>

      <Separator />

      {/* Danger Zone */}
      <div className="pt-2">
        <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-2">
          Danger Zone
        </p>
        <Button variant="destructive" className="w-full gap-2">
          <Trash2 className="size-4" />
          Delete Account
        </Button>
      </div>
    </div>
  );
};
