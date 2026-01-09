"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Moon, Sun } from "lucide-react";
import { Switch } from "../ui/switch";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                      checked={true}
                      onCheckedChange={() => {}}
                      className="data-[state=checked]:bg-[#009fb0]"
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
      <SidebarContent></SidebarContent>
      {/* Footer */}
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
    </Sidebar>
  );
}
