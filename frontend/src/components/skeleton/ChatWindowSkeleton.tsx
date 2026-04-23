import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { SidebarInset } from "@/components/ui/sidebar";

const ChatWindowSkeleton = () => {
  return (
    <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md">
      {/* Header skeleton */}
      <header className="sticky top-0 z-10 px-4 py-2 flex items-center bg-background">
        <div className="flex items-center gap-2 w-full">
          <Skeleton className="size-[18px] rounded-sm" />
          <Separator
            className="mr-2 data-[orientation=vertical]:h-4"
            orientation="vertical"
          />
          <div className="p-2 w-full flex items-center gap-3">
            {/* Avatar + badge */}
            <div className="relative">
              <Skeleton className="size-9 rounded-full" />
              <Skeleton className="absolute bottom-0 right-0 size-2.5 rounded-full" />
            </div>
            {/* Name */}
            <Skeleton className="h-4 w-32 rounded-full" />
          </div>
        </div>
      </header>

      {/* Body skeleton */}
      <div className="flex-1 overflow-y-auto bg-primary-foreground p-4 flex flex-col-reverse gap-3">
        {/* My message (right) */}
        <div className="flex flex-col items-end gap-1.5">
          <Skeleton className="h-9 w-44 rounded-full" />
          <Skeleton className="h-2.5 w-14 rounded" />
        </div>

        {/* Other message (left) */}
        <div className="flex items-end gap-2">
          <Skeleton className="size-7 rounded-full flex-shrink-0" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-9 w-56 rounded-full" />
            <Skeleton className="h-2.5 w-12 rounded" />
          </div>
        </div>

        {/* My message longer */}
        <div className="flex flex-col items-end gap-1.5">
          <Skeleton className="h-9 w-64 rounded-full" />
          <Skeleton className="h-2.5 w-14 rounded" />
        </div>

        {/* Other message shorter */}
        <div className="flex items-end gap-2">
          <Skeleton className="size-7 rounded-full flex-shrink-0" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-9 w-36 rounded-full" />
            <Skeleton className="h-2.5 w-12 rounded" />
          </div>
        </div>

        {/* My message short */}
        <div className="flex flex-col items-end gap-1.5">
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-2.5 w-14 rounded" />
        </div>

        {/* Other message multi-line */}
        <div className="flex items-start gap-2">
          <Skeleton className="size-7 rounded-full flex-shrink-0 mt-1" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-14 w-72 rounded-2xl" />
            <Skeleton className="h-2.5 w-12 rounded" />
          </div>
        </div>
      </div>

      {/* MessageInput skeleton */}
      <div className="flex items-center gap-2 p-3 min-h-[56px] bg-background">
        <Skeleton className="size-8 rounded-md flex-shrink-0" />
        <Skeleton className="flex-1 h-9 rounded-full" />
        <Skeleton className="size-9 rounded-md flex-shrink-0" />
      </div>
    </SidebarInset>
  );
};

export default ChatWindowSkeleton;
