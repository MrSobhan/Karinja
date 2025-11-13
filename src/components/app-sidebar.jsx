import  { useContext } from "react"
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
  Building2Icon,
  UserPen ,
  Bell
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
import AuthContext from "@/context/authContext"


export function AppSidebar({ ...props }) {

  const { user } = useContext(AuthContext);

  function getSidebarData() {
    if (!user || !user.user_role) {
      return {
        user: {
          name: "کاربر مهمان",
          email: "",
          avatar: "./src/image/user4.webp",
        },
        navMain: [
          {
            title: "داشبورد",
            titleSite: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboardIcon,
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
      };
    }

    if (user.user_role === "full_admin") {
      return {
        user: {
          name: user.user_full_name || "مدیر عامل",
          email: user.email || "",
          avatar: "./src/image/user4.webp",
        },
        navMain: [
          {
            title: "داشبورد",
            titleSite: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboardIcon,
          },
          {
            title: "مدیر ها",
            titleSite: "Admins",
            url: "/dashboard/admins",
            icon: ListIcon,
          },
          {
            title: "کاربران",
            titleSite: "Users",
            url: "/dashboard/users",
            icon: UsersIcon,
          },
          {
            title: "رزومه ها",
            titleSite: "Cv",
            url: "/dashboard/resumes",
            icon: FolderIcon,
          },
          {
            title: "اطلاعات شرکت ها",
            titleSite: "Employer Company",
            url: "/dashboard/employer-company",
            icon: Building2Icon,
          },
          {
            title: "لاگ فعالیت",
            titleSite: "Activity Log",
            url: "/dashboard/activity-log",
            icon: BarChartIcon,
          },
          {
            title: "فرصت های شغلی",
            titleSite: "Job Posting",
            url: "/dashboard/job-postings",
            icon: ClipboardListIcon,
          },
          {
            title: "در خواست کار",
            titleSite: "Job Application",
            url: "/dashboard/job-application",
            icon: UserPen,
          },
          {
            title: "اعلان ها",
            titleSite: "Notifications",
            url: "/dashboard/notifications",
            icon: Bell,
          }
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
      };
    }

    if (user.user_role === "admin") {
      return {
        user: {
          name: user.user_full_name || "ادمین",
          email: user.email || "",
          avatar: "./src/image/user4.webp",
        },
        navMain: [
          {
            title: "داشبورد",
            titleSite: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboardIcon,
          },
          {
            title: "کاربران",
            titleSite: "Users",
            url: "/dashboard/users",
            icon: UsersIcon,
          },
          {
            title: "رزومه ها",
            titleSite: "Cv",
            url: "/dashboard/resumes",
            icon: FolderIcon,
          },
          {
            title: "اطلاعات شرکت ها",
            titleSite: "Employer Company",
            url: "/dashboard/employer-company",
            icon: Building2Icon,
          },
          {
            title: "فرصت های شغلی",
            titleSite: "Job Posting",
            url: "/dashboard/job-postings",
            icon: ClipboardListIcon,
          },
          {
            title: "در خواست کار",
            titleSite: "Job Application",
            url: "/dashboard/job-application",
            icon: UserPen ,
          },
          {
            title: "اعلان ها",
            titleSite: "Notifications",
            url: "/dashboard/notifications",
            icon: Bell,
          }
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
      };
    }

    if (user.user_role === "employer") {
      return {
        user: {
          name: user.user_full_name || "کارفرما",
          email: user.email || "",
          avatar: "./src/image/user4.webp",
        },
        navMain: [
          {
            title: "داشبورد",
            titleSite: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboardIcon,
          },
          {
            title: "شرکت",
            titleSite: "Employer Company",
            url: "/dashboard/companies",
            icon: DatabaseIcon,
          },
          {
            title: "فرصت های شغلی",
            titleSite: "Job Posting",
            url: "/dashboard/job-postings",
            icon: ClipboardListIcon,
          },
          {
            title: "درخواست های ارسال شده",
            titleSite: "Job Application",
            url: "/dashboard/job-application",
            icon: UserPen,
          },
          {
            title: "اعلان ها",
            titleSite: "Notifications",
            url: "/dashboard/notifications",
            icon: Bell,
          }
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
      };
    }

    if (user.user_role === "job_seeker") {
      return {
        user: {
          name: user.user_full_name || "کارجو",
          email: user.email || "",
          avatar: "./src/image/user4.webp",
        },
        navMain: [
          {
            title: "داشبورد",
            titleSite: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboardIcon,
          },
          {
            title: "رزومه من",
            titleSite: "Job Seeker Resumes",
            url: "/dashboard/myresumes",
            icon: FolderIcon,
          },
          {
            title: "درخواست های شغلی من",
            titleSite: "Job Application",
            url: "/dashboard/my-job-applications",
            icon: FileTextIcon,
          },
          {
            title: "شغل‌های ذخیره‌شده",
            titleSite: "Saved Job",
            url: "/dashboard/saved-jobs",
            icon: DatabaseIcon,
          },
          {
            title: "تصاویر",
            titleSite: "Image",
            url: "/dashboard/images",
            icon: CameraIcon,
          },
          {
            title: "اعلان ها",
            titleSite: "Notifications",
            url: "/dashboard/notifications",
            icon: Bell,
          }
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
      };
    }

    return {
      user: {
        name: user.user_full_name || "کاربر",
        email: user.email || "",
        avatar: "./src/image/user4.webp",
      },
      navMain: [
        {
          title: "داشبورد",
          titleSite: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboardIcon,
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
    };
  }

  function Notification(props) {
    // simple bell icon fallback if lucide/react does not have Notification
    return (
      <svg {...props} width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 0 0-4-5.65V4a2 2 0 0 0-4 0v1.35A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2z" />
      </svg>
    );
  }

  const data = getSidebarData();

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
