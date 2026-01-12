import { cn } from "@/lib/utils";
import React from "react";

const StatusBadge = ({ status }: { status: "online" | "offline" }) => {
  return (
    <div
      className={cn(
        "size-4 absolute -bottom-0.5 -right-0.5  rounded-full border-2 border-white border-card",
        status === "online" && "status-online" ? "bg-green-500" : "bg-gray-400"
      )}
    ></div>
  );
};

export default StatusBadge;
