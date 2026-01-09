"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Moon, Sun } from "lucide-react";
import { Switch } from "../ui/switch";
import CreateNewChat from "../chat/CreateNewChat";
import NewGroupChatModel from "../chat/NewGroupChatModel";
import GroupChatList from "../chat/GroupChatList";
import AddFriendModal from "../chat/AddFriendModal";
import DirectChatList from "../chat/DirectChatList";
import { useThemeStore } from "@/stores/useThemeStore";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <Sidebar variant="inset" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="bg-gradient-to-r from-[#009fb0] via-[#00c0d1] to-[#7ce9f0]"
            >
              <a href="#">
                <div className="flex w-full items-center justify-between px-2 ">
                  <h1 className="text-lg font-bold text-white">ChatApp</h1>
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-yellow-400" />
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={toggleTheme}
                          className="h-6 w-11 rounded-full bg-gray-300 data-[state=checked]:bg-[#009fb0] transition-colors [&>span]:h-5 [&>span]:w-5 [&>span]:rounded-full [&>span]:bg-white [&>span]:shadow-md [&>span]:transition-transform [&>span]:translate-x-0.5 data-[state=checked]:[&>span]:translate-x-5"
                    />
                    <Moon className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* Content */}
      <SidebarContent>
        {/* New Chat */}
        <SidebarGroup>
          <SidebarContent>
            <CreateNewChat />
          </SidebarContent>
        </SidebarGroup>
        {/* Groups */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">Nhóm Chat</SidebarGroupLabel>
          <SidebarGroupAction title="Tạo nhóm" className="cursor-pointer">
            <NewGroupChatModel />
          </SidebarGroupAction>
          <SidebarContent>
            <GroupChatList />
          </SidebarContent>
        </SidebarGroup>
        {/* Chats */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">Bạn bè</SidebarGroupLabel>
          <SidebarGroupAction title="Kết bạn" className="cursor-pointer">
            <AddFriendModal />
          </SidebarGroupAction>
          <SidebarContent>
            <DirectChatList />
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>
      {/* Footer */}
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
    </Sidebar>
  );
}
