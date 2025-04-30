"use client";
import * as React from "react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { FiSun, FiMoon } from "react-icons/fi"
import AuthContext from "@/context/authContext";
import { Button } from "./ui/button";

export function NavSecondary({
  items,
  ...props
}) {
  const authContext = React.useContext(AuthContext)
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => authContext.toggleTheme()}>
              {authContext.darkMode ? (
                <>
                  <FiSun className="text-gray-100" />
                  <span>حالت روشن</span>
                </>
              ) : (
                <>
                  <FiMoon className="text-gray-900" />
                  <span>حالت تاریک</span>
                </>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
