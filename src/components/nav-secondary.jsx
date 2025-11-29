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
import { LogOutIcon } from "lucide-react";
import { Link } from "react-router-dom";


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
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
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
            <SidebarMenuButton
              className="flex flex-row-reverse gap-2 text-red-600  hover:text-red-700 w-full justify-end my-2"
              onClick={() => authContext.LogOut()}>
              خروج
              <LogOutIcon className="ml-1" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
