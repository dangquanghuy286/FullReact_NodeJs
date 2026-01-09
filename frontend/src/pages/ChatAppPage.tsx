import ChatWindowApp from "@/components/chat/ChatWindowApp";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const ChatAppPage = () => {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex h-screen w-full p-2">
          <ChatWindowApp />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ChatAppPage;
