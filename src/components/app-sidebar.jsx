import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { HiOutlineLocationMarker } from "react-icons/hi";
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"

const data = {
  user: {
    name: "محمد کاظمی",
    email: "m@example.com",
    avatar: "./src/image/user4.webp",
  },
  navMain: [
    {
      title: "داشبورد",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "مدیر ها",
      url: "admins",
      icon: ListIcon,
    },
    {
      title: "کاربران",
      url: "users",
      icon: UsersIcon,
    },
    {
      title: "رزومه ها",
      url: "#",
      icon: FolderIcon,
    },

  ],
  navSecondary: [
    {
      title: "تنظیمات",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "دریافت کمک",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "جستجو",
      url: "#",
      icon: SearchIcon,
    },
  ],
}


export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/" className="flex items-center gap-1 mb-3">
              <HiOutlineLocationMarker className="text-3xl text-gray-800 dark:text-white" />

              <span className="text-2xl font-semibold moraba">کاراینجا</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
