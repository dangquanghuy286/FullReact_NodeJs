import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Camera,
  Lock,
  Bell,
  ShieldOff,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";

// ─── Schemas ────────────────────────────────────────────────────────────────
const profileSchema = z.object({
  displayName: z.string().min(1, "Vui lòng nhập tên hiển thị"),
  username: z.string().min(3, "Tên người dùng ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
  bio: z.string().max(160, "Giới thiệu tối đa 160 ký tự").optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Nhập mật khẩu hiện tại"),
    newPassword: z.string().min(6, "Mật khẩu mới ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

// ─── LoadingDots ─────────────────────────────────────────────────────────────
const LoadingDots = () => (
  <span className="flex items-center justify-center gap-[3px]">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="size-1 rounded-full bg-[#00c0d1]"
        style={{
          animation: "dotBounce 1.2s ease-in-out infinite",
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
    <style>{`@keyframes dotBounce{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1.15);opacity:1}}`}</style>
  </span>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ProfileSettingsTabs = () => {
  const { user } = useAuthStore();
  const { updateAvatarUrl } = useUserStore();

  // Avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setAvatarLoading(true);
    try {
      await updateAvatarUrl(formData);
    } finally {
      setAvatarLoading(false);
    }
  };

  // Config toggles
  const [darkMode, setDarkMode] = useState(false);
  const [showOnline, setShowOnline] = useState(true);

  // Password visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Profile form
  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors, isDirty: profileDirty },
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

  // Password form
  const {
    register: regPassword,
    handleSubmit: handlePassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSaveProfile = async (data: ProfileFormData) => {
    // TODO: call update profile API
    console.log("Save profile", data);
  };

  const onChangePassword = async (data: PasswordFormData) => {
    // TODO: call change password API
    console.log("Change password", data);
    resetPassword();
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-0 w-full">
      <Tabs defaultValue="account" className="w-full">
        {/* ── Tab triggers ── */}
        <TabsList className="grid w-full grid-cols-3 rounded-xl bg-muted/60 p-1 mb-4">
          <TabsTrigger
            value="account"
            className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#00a0b0]"
          >
            Tài Khoản
          </TabsTrigger>
          <TabsTrigger
            value="config"
            className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#00a0b0]"
          >
            Cấu Hình
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#00a0b0]"
          >
            Bảo Mật
          </TabsTrigger>
        </TabsList>

        {/* ══════════════════════════════════════════════
            TAB 1 — TÀI KHOẢN
        ══════════════════════════════════════════════ */}
        <TabsContent
          value="account"
          className="mt-0 focus-visible:outline-none"
        >
          <form onSubmit={handleProfile(onSaveProfile)} className="space-y-5">
            {/* Section header */}
            <div className="flex items-center gap-2">
              <span className="text-[#00c0d1]">♡</span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Thông tin cá nhân
                </p>
                <p className="text-xs text-muted-foreground">
                  Cập nhật chi tiết cá nhân và thông tin hồ sơ của bạn
                </p>
              </div>
            </div>

            {/* Row: Tên hiển thị + Tên người dùng */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="displayName"
                  className="text-xs text-muted-foreground"
                >
                  Tên hiển thị
                </Label>
                <Input
                  id="displayName"
                  className="h-9 text-sm focus-visible:ring-[#00c0d1]"
                  {...regProfile("displayName")}
                />
                {profileErrors.displayName && (
                  <p className="text-[11px] text-destructive">
                    {profileErrors.displayName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="username"
                  className="text-xs text-muted-foreground"
                >
                  Tên người dùng
                </Label>
                <Input
                  id="username"
                  className="h-9 text-sm focus-visible:ring-[#00c0d1] ring-1 ring-[#00c0d1]/40"
                  {...regProfile("username")}
                />
                {profileErrors.username && (
                  <p className="text-[11px] text-destructive">
                    {profileErrors.username.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row: Email + Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs text-muted-foreground"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="h-9 text-sm focus-visible:ring-[#00c0d1]"
                  {...regProfile("email")}
                />
                {profileErrors.email && (
                  <p className="text-[11px] text-destructive">
                    {profileErrors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="phone"
                  className="text-xs text-muted-foreground"
                >
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  className="h-9 text-sm focus-visible:ring-[#00c0d1]"
                  {...regProfile("phone")}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-xs text-muted-foreground">
                Giới thiệu
              </Label>
              <Textarea
                id="bio"
                rows={3}
                className="text-sm resize-none focus-visible:ring-[#00c0d1]"
                {...regProfile("bio")}
              />
              {profileErrors.bio && (
                <p className="text-[11px] text-destructive">
                  {profileErrors.bio.message}
                </p>
              )}
            </div>

            {/* Save button */}
            <Button
              type="submit"
              disabled={!profileDirty}
              className="bg-gradient-to-r from-[#00c0d1] to-[#007a8a] hover:opacity-90 text-white rounded-xl h-9 px-6 text-sm font-medium shadow-md disabled:opacity-50"
            >
              Lưu thay đổi
            </Button>
          </form>
        </TabsContent>

        {/* ══════════════════════════════════════════════
            TAB 2 — CẤU HÌNH
        ══════════════════════════════════════════════ */}
        <TabsContent value="config" className="mt-0 focus-visible:outline-none">
          <div className="space-y-5">
            {/* Section header */}
            <div className="flex items-center gap-2">
              <span className="text-[#00c0d1]">✦</span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Tuỳ chỉnh ứng dụng
                </p>
                <p className="text-xs text-muted-foreground">
                  Cá nhân hoá trải nghiệm trò chuyện của bạn
                </p>
              </div>
            </div>

            <Separator />

            {/* Dark mode */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Chế độ tối</p>
                <p className="text-xs text-muted-foreground">
                  Chuyển đổi giữa giao diện sáng và tối
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="size-4 text-muted-foreground" />
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  className="data-[state=checked]:bg-[#00c0d1]"
                />
                <Moon className="size-4 text-muted-foreground" />
              </div>
            </div>

            <Separator />

            {/* Show online status */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">
                  Hiển thị trạng thái online
                </p>
                <p className="text-xs text-muted-foreground">
                  Cho phép người khác thấy khi bạn đang online
                </p>
              </div>
              <Switch
                checked={showOnline}
                onCheckedChange={setShowOnline}
                className="data-[state=checked]:bg-[#00c0d1]"
              />
            </div>
          </div>
        </TabsContent>

        {/* ══════════════════════════════════════════════
            TAB 3 — BẢO MẬT
        ══════════════════════════════════════════════ */}
        <TabsContent
          value="security"
          className="mt-0 focus-visible:outline-none"
        >
          <div className="space-y-5">
            {/* Section header */}
            <div className="flex items-center gap-2">
              <span className="text-[#00c0d1]">
                <ShieldOff className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Quyền riêng tư & Bảo mật
                </p>
                <p className="text-xs text-muted-foreground">
                  Quản lý cài đặt quyền riêng tư và bảo mật của bạn
                </p>
              </div>
            </div>

            {/* Change password */}
            <form
              onSubmit={handlePassword(onChangePassword)}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Lock className="size-4 text-muted-foreground" />
                Đổi mật khẩu
              </div>

              {/* Current password */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Mật khẩu hiện tại
                </Label>
                <div className="relative">
                  <Input
                    type={showCurrent ? "text" : "password"}
                    className="h-9 text-sm pr-9 focus-visible:ring-[#00c0d1]"
                    {...regPassword("currentPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrent ? (
                      <EyeOff className="size-3.5" />
                    ) : (
                      <Eye className="size-3.5" />
                    )}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-[11px] text-destructive">
                    {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* New password */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Mật khẩu mới
                  </Label>
                  <div className="relative">
                    <Input
                      type={showNew ? "text" : "password"}
                      className="h-9 text-sm pr-9 focus-visible:ring-[#00c0d1]"
                      {...regPassword("newPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNew ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-[11px] text-destructive">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Xác nhận mật khẩu
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      className="h-9 text-sm pr-9 focus-visible:ring-[#00c0d1]"
                      {...regPassword("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirm ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-[11px] text-destructive">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                variant="outline"
                className="h-9 text-sm border-[#00c0d1]/40 text-[#00a0b0] hover:bg-[#00c0d1]/10"
              >
                Cập nhật mật khẩu
              </Button>
            </form>

            <Separator />

            {/* Notification settings */}
            <button className="w-full flex items-center gap-3 py-2 text-sm text-foreground hover:text-[#00a0b0] transition-colors group">
              <Bell className="size-4 text-muted-foreground group-hover:text-[#00c0d1] transition-colors" />
              Cài đặt thông báo
            </button>

            <Separator />

            {/* Block & Report */}
            <button className="w-full flex items-center gap-3 py-2 text-sm text-foreground hover:text-[#00a0b0] transition-colors group">
              <ShieldOff className="size-4 text-muted-foreground group-hover:text-[#00c0d1] transition-colors" />
              Chặn & Báo cáo
            </button>

            <Separator />

            {/* Danger zone */}
            <div className="space-y-2 pt-1">
              <p className="text-xs font-semibold text-destructive uppercase tracking-wider">
                Khu vực nguy hiểm
              </p>
              <Button
                variant="destructive"
                className="w-full h-9 text-sm font-medium rounded-xl gap-2"
              >
                <Trash2 className="size-4" />
                Xoá tài khoản
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Hidden file input for avatar */}
      <input
        type="file"
        accept="image/*"
        hidden
        ref={fileInputRef}
        onChange={handleAvatarUpload}
      />
    </div>
  );
};

export default ProfileSettingsTabs;
