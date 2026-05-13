import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFriendStore } from "@/stores/friend.store";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import SendRequests from "./SentRequest";
import ReceivedRequests from "./ReceivedRequests";
import { useTranslation } from "react-i18next";

interface FriendRequestDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const FriendRequestDialog = ({ open, setOpen }: FriendRequestDialogProps) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState("received");
  const { getAllFriendRequests } = useFriendStore();

  useEffect(() => {
    const loadRequest = async () => {
      try {
        await getAllFriendRequests();
      } catch (error) {
        console.error("Error loading friend requests:", error);
      }
    };

    loadRequest();
  }, []);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#00c0d1] to-[#007a8a]" />
              <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
                {t("friendRequest.title")}
              </DialogTitle>
            </div>
          </DialogHeader>

          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="received">
                {t("friendRequest.tabs.received")}
              </TabsTrigger>
              <TabsTrigger value="sent">
                {t("friendRequest.tabs.sent")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="received">
              <ReceivedRequests />
            </TabsContent>
            <TabsContent value="sent">
              <SendRequests />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FriendRequestDialog;
