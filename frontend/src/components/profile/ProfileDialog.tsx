import type { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ProfileCard from "./ProfileCard";

import { useAuthStore } from "@/stores/auth.store";
import ProfileSettingsTabs from "./Profilesettingstabs";

interface ProfileDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ProfileDialog = ({ open, setOpen }: ProfileDialogProps) => {
  const { user } = useAuthStore();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 border-0 shadow-2xl rounded-2xl max-w-lg">
        <div className="relative">
          <div className="px-6 pt-5 pb-6 space-y-4">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#00c0d1] to-[#007a8a]" />
                <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
                  Profile & Settings
                </DialogTitle>
              </div>

              {/* Profile card banner */}
              <ProfileCard user={user} />
            </DialogHeader>

            {/* Tabs section */}
            <ProfileSettingsTabs />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
