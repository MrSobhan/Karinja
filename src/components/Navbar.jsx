import React, { useState, useContext } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { LuLogIn } from "react-icons/lu";
import { FiSun, FiMoon } from "react-icons/fi";
import AuthContext from "@/context/authContext";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoPersonOutline } from "react-icons/io5";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MdPerson,
    MdCreditCard,
    MdSettings,
    MdLogout,
    MdSupport,
} from "react-icons/md";
import { NavbarDock } from "./NavbarDock";

export function Navbar() {
    const [active, setActive] = useState(null);
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await authContext.LogOut();
        navigate("/login");
    };

    const isLoggedIn = !!authContext.isLogin && authContext.isLogin();

    return (
        <div>
            <div className="fixed left-0 top-2 z-50 w-full lg:flex justify-between items-center px-2 md:px-6 py-4 hidden ">
                <div className="flex items-center mx-auto dana">
                    <Menu setActive={setActive}>
                        <Link to={'/'}>
                            <div className="flex items-center gap-1">
                                <HiOutlineLocationMarker className="text-2xl text-gray-800 dark:text-white" />
                                <span className="text-xl font-bold text-gray-800 dark:text-white moraba">
                                    کاراینجا
                                </span>
                            </div>
                        </Link>

                        <div className="hidden md:flex !mx-20 gap-6 text-sm">
                            <MenuItem setActive={setActive} active={active} item="فرصت‌های شغلی">
                                <div className="flex flex-col space-y-3 text-sm text-right">
                                    <Link to="/jobs/all"><HoveredLink>همه آگهی‌ها</HoveredLink></Link>
                                    <Link to="/jobs/remote"><HoveredLink>فرصت‌های دورکاری</HoveredLink></Link>
                                    <Link to="/jobs/internship"><HoveredLink>کارآموزی</HoveredLink></Link>
                                </div>
                            </MenuItem>

                            <MenuItem setActive={setActive} active={active} item="رزومه‌ساز">
                                <div className="flex flex-col space-y-3 text-sm text-right">
                                    <Link to="/resume-builder"><HoveredLink>ساخت رزومه جدید</HoveredLink></Link>
                                    <Link to="/resumes"><HoveredLink>رزومه‌های من</HoveredLink></Link>
                                </div>
                            </MenuItem>

                            <MenuItem setActive={setActive} active={active} item="برای کارفرماها">
                                <div className="grid grid-cols-2 gap-4 text-sm p-2 text-right">
                                    <Link to="/employer/post-job">
                                        <ProductItem
                                            title="ثبت آگهی"
                                            src="https://cdn.jobvision.ir/images/icons/post-job.png"
                                            description="آگهی شغلی خود را منتشر کنید"
                                        />
                                    </Link>
                                    <Link to="/employer/dashboard">
                                        <ProductItem
                                            title="داشبورد کارفرما"
                                            src="https://cdn.jobvision.ir/images/icons/employer-dashboard.png"
                                            description="مدیریت رزومه‌ها و آگهی‌ها"
                                        />
                                    </Link>
                                </div>
                            </MenuItem>

                            <MenuItem setActive={setActive} active={active} item="راهنما">
                                <div className="flex flex-col space-y-3 text-sm text-right">
                                    <Link to="/help"><HoveredLink>راهنمای سایت</HoveredLink></Link>
                                    <Link to="/faq"><HoveredLink>سوالات متداول</HoveredLink></Link>
                                    <Link to="/contact"><HoveredLink>تماس با ما</HoveredLink></Link>
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
                            {!isLoggedIn ? (
                                <Link to="/login">
                                    <Button variant="outline" className="rounded-full w-9 h-9 shadow-md">
                                        <LuLogIn />
                                    </Button>
                                </Link>
                            ) : (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="rounded-full w-9 h-9 shadow-md"><IoPersonOutline /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-48 text-right" dir="rtl">
                                        <DropdownMenuLabel>حساب کاربری</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem asChild>
                                                <Link to={'/dashboard'} className="flex cursor-pointer">
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
                                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                                            <MdLogout className="ml-2 text-lg" />
                                            خروج
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </Menu>
                </div>
            </div>
            <NavbarDock />
        </div>
    );
}
