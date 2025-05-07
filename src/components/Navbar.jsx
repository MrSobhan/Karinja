import React, { useState, useContext } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LuLogIn } from "react-icons/lu";
import { FiSun, FiMoon } from "react-icons/fi"
import AuthContext from "@/context/authContext";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoPersonOutline } from "react-icons/io5";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    MdPerson,
    MdCreditCard,
    MdSettings,
    MdKeyboard,
    MdGroup,
    MdMail,
    MdMessage,
    MdMoreHoriz,
    MdGroupAdd,
    MdLogout,
    MdApi,
    MdSupport,
    MdCode,
} from "react-icons/md";
import { NavbarDock } from "./NavbarDock";

export function Navbar() {
    const [active, setActive] = useState(null);
    const authContext = useContext(AuthContext)


    return (
        <div>
            <div className=" fixed left-0 top-2 z-50 w-full lg:flex justify-between items-center px-2 md:px-6 py-4 hidden ">


                <div className="flex items-center mx-auto dana">
                    <Menu setActive={setActive}>
                        <Link to={'/'}>
                            <div className="flex items-center gap-1">
                                {/* <img
                src="./src/image/01.png"
                alt="لوگوی کاراینجا"
                className="w-8 rounded-full"
            /> */}
                                <HiOutlineLocationMarker className="text-2xl text-gray-800 dark:text-white" />

                                <span className="text-xl font-bold text-gray-800 dark:text-white moraba">
                                    کاراینجا
                                </span>
                            </div>
                        </Link>

                        <div className="hidden md:flex !mx-20 gap-6 text-sm">
                            <MenuItem setActive={setActive} active={active} item="فرصت‌های شغلی">
                                <div className="flex flex-col space-y-3 text-sm text-right">
                                    <HoveredLink href="/jobs/all">همه آگهی‌ها</HoveredLink>
                                    <HoveredLink href="/jobs/remote">فرصت‌های دورکاری</HoveredLink>
                                    <HoveredLink href="/jobs/internship">کارآموزی</HoveredLink>
                                </div>
                            </MenuItem>

                            <MenuItem setActive={setActive} active={active} item="رزومه‌ساز">
                                <div className="flex flex-col space-y-3 text-sm text-right">
                                    <HoveredLink href="/resume-builder">ساخت رزومه جدید</HoveredLink>
                                    <HoveredLink href="/resumes">رزومه‌های من</HoveredLink>
                                </div>
                            </MenuItem>

                            <MenuItem setActive={setActive} active={active} item="برای کارفرماها">
                                <div className="grid grid-cols-2 gap-4 text-sm p-2 text-right">
                                    <ProductItem
                                        title="ثبت آگهی"
                                        href="/employer/post-job"
                                        src="https://cdn.jobvision.ir/images/icons/post-job.png"
                                        description="آگهی شغلی خود را منتشر کنید"
                                    />
                                    <ProductItem
                                        title="داشبورد کارفرما"
                                        href="/employer/dashboard"
                                        src="https://cdn.jobvision.ir/images/icons/employer-dashboard.png"
                                        description="مدیریت رزومه‌ها و آگهی‌ها"
                                    />
                                </div>
                            </MenuItem>

                            <MenuItem setActive={setActive} active={active} item="راهنما">
                                <div className="flex flex-col space-y-3 text-sm text-right">
                                    <HoveredLink href="/help">راهنمای سایت</HoveredLink>
                                    <HoveredLink href="/faq">سوالات متداول</HoveredLink>
                                    <HoveredLink href="/contact">تماس با ما</HoveredLink>
                                </div>
                            </MenuItem>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => authContext.toggleTheme()}
                                variant="outline"
                                className="rounded-full w-9 h-9 shadow-md"
                            >
                                {authContext.darkMode ? (
                                    <FiSun className="text-gray-100" />
                                ) : (
                                    <FiMoon className="text-gray-900" />
                                )}
                            </Button>
                            <Link to="/login">
                                <Button variant="outline"
                                    className="rounded-full w-9 h-9 shadow-md">
                                    <LuLogIn />
                                </Button>
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="rounded-full w-9 h-9 shadow-md"><IoPersonOutline /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48 text-right" dir="rtl">
                                    <DropdownMenuLabel>حساب کاربری</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <Link to={'/dashboard'} className="flex">
                                                <MdPerson className="ml-2 text-lg" />
                                                پروفایل
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <MdCreditCard className="ml-2 text-lg" />
                                            صورتحساب
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <MdSettings className="ml-2 text-lg" />
                                            تنظیمات
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator />


                                    <DropdownMenuItem>
                                        <MdSupport className="ml-2 text-lg" />
                                        پشتیبانی
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <MdLogout className="ml-2 text-lg" />
                                        خروج
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </Menu>
                </div>


            </div>
            <NavbarDock />
        </div>
    );
}
