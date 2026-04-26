import { Badge } from "../ui/badge";

const UnreadCount = ({ unreadCount }: { unreadCount: number }) => {
  if (!unreadCount) return null;

  return (
    <div className="absolute -top-1 -right-1 z-20 flex items-center justify-center">
      {/* Pulse animation */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-70 animate-ping"></span>

      {/* Badge */}
      <Badge
        className="
        relative flex items-center justify-center
        min-w-[20px] h-[20px] px-1
        text-[11px] font-semibold
        rounded-full
        bg-red-500 text-white
        shadow-md
        border-2 border-white
      "
      >
        {unreadCount > 9 ? "9+" : unreadCount}
      </Badge>
    </div>
  );
};

export default UnreadCount;
