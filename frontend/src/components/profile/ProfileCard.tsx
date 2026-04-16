import type { User } from "@/types/user";
import { Card, CardContent } from "../ui/card";
import UserAvatar from "../chat/UserAvatar";
import { Badge } from "../ui/badge";
import { useSocketStore } from "@/stores/socket.store";
import { cn } from "@/lib/utils";
import AvatarUploader from "./AvatarUploader";

interface ProfileCardProps {
  user: User | null;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  const { onlineUsers } = useSocketStore();
  if (!user) return;
  const bio = user.bio ?? "Will code for food";
  const isOnline = onlineUsers.includes(user._id);

  return (
    <Card
      className="overflow-hidden p-0 border-0 shadow-xl"
      style={{ height: "220px" }}
    >
      {/* Background layers */}
      <div className="relative h-full">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00c0d1] via-[#0096a8] to-[#005f6e]" />

        {/* Geometric accent shapes */}
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5 blur-sm" />
        <div className="absolute top-4 right-16 w-24 h-24 rounded-full bg-white/8" />
        <div className="absolute -bottom-6 left-1/3 w-36 h-36 rounded-full bg-[#00e5f7]/10" />

        {/* Subtle diagonal stripe texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)",
          }}
        />

        {/* Content */}
        <CardContent className="relative h-full flex flex-col justify-end pb-5 px-5">
          {/* Top label */}
          <p className="absolute top-4 right-5 text-white/30 text-[10px] font-medium tracking-[0.2em] uppercase">
            Profile
          </p>

          <div className="flex flex-row items-end gap-5 w-full">
            {/* Avatar with glow ring */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-white/20 blur-md scale-110" />
              <div className="relative ring-[3px] ring-white/70 rounded-full shadow-2xl">
                <UserAvatar
                  type="profile"
                  name={user.displayName}
                  avatarURL={user.avatarURL ?? undefined}
                />
              </div>
              <AvatarUploader />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1.5 min-w-0 flex-1 pb-0.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-white text-2xl font-bold leading-tight tracking-tight drop-shadow-sm truncate">
                  {user.displayName}
                </h1>
                <Badge
                  className={cn(
                    "border-0 text-[11px] px-2 py-0.5 flex items-center gap-1.5 rounded-full font-medium shadow-sm",
                    isOnline
                      ? "bg-green-400/20 text-green-100 backdrop-blur-sm"
                      : "bg-white/10 text-white/60 backdrop-blur-sm",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      isOnline ? "bg-green-300 animate-pulse" : "bg-white/40",
                    )}
                  />
                  {isOnline ? "Online" : "Offline"}
                </Badge>
              </div>

              {/* Divider */}
              <div className="w-10 h-[2px] rounded-full bg-white/30" />

              <p className="text-white/70 text-sm leading-snug max-w-sm truncate">
                {bio}
              </p>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ProfileCard;
