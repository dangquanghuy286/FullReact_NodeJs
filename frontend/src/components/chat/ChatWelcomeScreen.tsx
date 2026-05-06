import { useTranslation } from "react-i18next";
import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";

const ChatWelcomeScreen = () => {
  const { t } = useTranslation();

  return (
    <SidebarInset className="flex w-full h-full bg-transparent">
      <ChatWindowHeader />
      <div className="flex bg-primary-foreground rounded-2xl flex-1 items-center justify-center">
        <div className="text-center">
          <div className="size-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
            <span className="text-3xl">☀️</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 bg-gradient-chat bg-clip-text text-transparent">
            {t("chat.welcome.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("chat.welcome.subtitle")}
          </p>
        </div>
      </div>
    </SidebarInset>
  );
};

export default ChatWelcomeScreen;
