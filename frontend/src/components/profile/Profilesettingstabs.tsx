import { useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/auth.store";
import { AccountTab } from "./AccountTab";
import { ConfigTab } from "./ConfigTab";
import { SecurityTab } from "./SecurityTab";

const ProfileSettingsTabs = () => {
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  return (
    <div className="flex flex-col gap-0 w-full">
      <Tabs defaultValue="account" className="w-full">
        {/* Tab Headers */}
        <TabsList className="grid w-full grid-cols-3 rounded-xl bg-muted/60 p-1 mb-4">
          <TabsTrigger
            value="account"
            className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#00a0b0]"
          >
            Account
          </TabsTrigger>
          <TabsTrigger
            value="config"
            className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#00a0b0]"
          >
            Configuration
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#00a0b0]"
          >
            Security
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        <TabsContent
          value="account"
          className="mt-0 focus-visible:outline-none"
        >
          <AccountTab />
        </TabsContent>

        <TabsContent value="config" className="mt-0 focus-visible:outline-none">
          <ConfigTab />
        </TabsContent>

        <TabsContent
          value="security"
          className="mt-0 focus-visible:outline-none"
        >
          <SecurityTab />
        </TabsContent>
      </Tabs>

      {/* Hidden file input */}
      <input type="file" accept="image/*" hidden ref={fileInputRef} />
    </div>
  );
};

export default ProfileSettingsTabs;
