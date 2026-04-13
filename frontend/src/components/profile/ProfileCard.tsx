import type { User } from "@/types/user";
import { Card, CardContent } from "../ui/card";
import UserAvatar from "../chat/UserAvatar";
import { Badge } from "../ui/badge";
import { useSocketStore } from "@/stores/socket.store";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  user: User | null;
}
// Ui Profile Card
const ProfileCard = ({ user }: ProfileCardProps) => {
  const { onlineUsers } = useSocketStore();
  if (!user) return;
  const bio = user.bio ?? "Will code for food";
  const isOnline = onlineUsers.includes(user._id) ? true : false;
  return (
    <Card className="overflow-hidden p-0 h-52 bg-gradient-to-r from-[#00c0d1] via-[#009fb3] to-[#007a8a]">
      <CardContent className="h-full flex items-end pb-3 px-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full">
          {/* Avatar */}
          <UserAvatar
            type="profile"
            name={user.displayName}
            avatarUrl={user.avatarURL ?? undefined}
            className="ring-4 ring-white shadow-lg"
          />

          {/* Info */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-white text-xl font-semibold leading-tight">
                {user.displayName}
              </h1>
              <Badge
                className={cn(
                  "border-0 text-xs px-2 py-0.5 flex items-center gap-1",
                  isOnline
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-700",
                )}
              >
                <span
                  className={cn(
                    "size-2 rounded-full",
                    isOnline ? "bg-green-400 animate-pulse" : "bg-slate-500",
                  )}
                />
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
            <p className="text-white/80 text-sm leading-snug max-w-md">{bio}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
