import { useContext } from "react"
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
  UserPen,
  Bell,
  FileUser,
  BookText,
  Brain,
  BriefcaseBusiness,
  Rss
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
            url: "/dashboard/settings",
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
            title: "اطلاعات کارجویان",
            titleSite: "Job Seeker Personal Informations",
            url: "/dashboard/job-seeker-personal-informations",
            icon: FileUser,
          },
          {
            title: "تحصیلات کارجویان",
            titleSite: "Job Seeker Education",
            url: "/dashboard/job-seeker-education",
            icon: BookText,
          },
          {
            title: "مهارت‌های کارجویان",
            titleSite: "Job Seeker Skill",
            url: "/dashboard/job-seeker-skills",
            icon: Brain,
          },
          {
            title: "سوابق شغلی کارجویان",
            titleSite: "Job Seeker Work Experiences",
            url: "/dashboard/job-seeker-work-experiences",
            icon: BriefcaseBusiness,
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
            title: "وبلاگ ها",
            titleSite: "Blogs",
            url: "/dashboard/blogs",
            icon: Rss,
          },

        ],
        navSecondary: [
          {
            title: "تنظیمات",
            url: "/dashboard/settings",
            icon: SettingsIcon,
          },
          {
            title: "دریافت کمک",
            url: "#",
            icon: HelpCircleIcon,
          },
          {
            title: "جستجو",
            url: "/dashboard/search",
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
            title: "اطلاعات کارجویان",
            titleSite: "Job Seeker Personal Informations",
            url: "/dashboard/job-seeker-personal-informations",
            icon: FileUser,
          },
          {
            title: "تحصیلات کارجویان",
            titleSite: "Job Seeker Education",
            url: "/dashboard/job-seeker-education",
            icon: BookText,
          },
          {
            title: "مهارت‌های کارجویان",
            titleSite: "Job Seeker Skill",
            url: "/dashboard/job-seeker-skills",
            icon: Brain,
          },
          {
            title: "سوابق شغلی کارجویان",
            titleSite: "Job Seeker Work Experiences",
            url: "/dashboard/job-seeker-work-experiences",
            icon: BriefcaseBusiness,
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
            icon: UserPen,
          },
          {
            title: "وبلاگ ها",
            titleSite: "Blogs",
            url: "/dashboard/blogs",
            icon: Rss,
          },

        ],
        navSecondary: [
          {
            title: "تنظیمات",
            url: "/dashboard/settings",
            icon: SettingsIcon,
          },
          {
            title: "دریافت کمک",
            url: "#",
            icon: HelpCircleIcon,
          },
          {
            title: "جستجو",
            url: "/dashboard/search",
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

        ],
        navSecondary: [
          {
            title: "تنظیمات",
            url: "/dashboard/settings",
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
            title: "اطلاعات شخصی",
            titleSite: "My Personal Informations",
            url: "/dashboard/my-personal-informations",
            icon: UsersIcon,
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

        ],
        navSecondary: [
          {
            title: "تنظیمات",
            url: "/dashboard/settings",
            icon: SettingsIcon,
          },
          {
            title: "دریافت کمک",
            url: "#",
            icon: HelpCircleIcon,
          },
          {
            title: "جستجو",
            url: "/dashboard/search",
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
          url: "/dashboard/search",
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
          <SidebarMenuItem className="flex justify-between mb-3">
            <Link to="/" className="flex items-center gap-1">
              <HiOutlineLocationMarker className="text-3xl text-gray-800 dark:text-white" />
              <span className="text-2xl font-semibold moraba">کاراینجا</span>
            </Link>
              <Link to={"/dashboard/notifications"} className="relative group">
                <Bell
                  className="w-5 cursor-pointer transition-transform duration-150 active:scale-110"
                  style={{ verticalAlign: "middle" }}
                />
                <span
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse group-hover:animate-none"
                />
              </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto border-t border-solid border-gray-500/50 pt-3" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
