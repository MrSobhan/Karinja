import React, { useContext } from "react";
import { FloatingDock } from "@/components/ui/floating-dock";

import { HiOutlineHome , HiOutlineBriefcase , HiOutlineFingerPrint  } from "react-icons/hi";
import { RiArticleLine } from "react-icons/ri";
import { LuLogIn } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import AuthContext from "@/context/authContext";
import { useNavigate } from "react-router-dom";

export function NavbarDock() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const isLoggedIn = authContext.isLogin();

  const handleLogout = async () => {
    await authContext.LogOut();
    navigate("/login");
  };

  const links = [
    {
      title: "خانه",
      icon: (
        <HiOutlineHome className="h-6 w-6 text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },
    {
      title: "مشاغل",
      icon: (
        <HiOutlineBriefcase className="h-6 w-6 text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/jobs/all",
    },
    {
      title: "وبلاگ",
      icon: (
        <RiArticleLine className="h-6 w-6 text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/blog",
    },
    isLoggedIn
      ? {
          title: "داشبورد",
          icon: (
            <HiOutlineFingerPrint className="h-6 w-6 text-neutral-500 dark:text-neutral-300" />
          ),
          href: "/dashboard",
        }
      : {
          title: "ورود",
          icon: (
            <LuLogIn className="h-6 w-6 text-neutral-500 dark:text-neutral-300" />
          ),
          href: "/login",
        },
    isLoggedIn && {
      title: "خروج",
      icon: (
        <MdLogout className="h-6 w-6 text-red-500 dark:text-red-400" onClick={handleLogout} />
      ),
    },
  ].filter(Boolean);

  return (
    <div className="flex items-center justify-center fixed bottom-4 left-0 z-50 w-full lg:hidden">
      <FloatingDock items={links} />
    </div>
  );
}
