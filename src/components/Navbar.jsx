import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router-dom";
import { LuLogIn } from "react-icons/lu";

export function Navbar() {
    const [active, setActive] = useState(null);

    return (
        <div className="relative w-full flex justify-between items-center px-2 md:px-6 py-4">


            <div className="flex items-center mx-auto dana">
                <Menu setActive={setActive}>
                    <div className="flex items-center gap-3">
                        <img
                            src="./src/image/logoKar.png"
                            alt="لوگوی کاراینجا"
                            className="w-7 rounded-full"
                        />
                        <span className="text-xl font-bold text-gray-800 dark:text-white moraba">
                            کاراینجا
                        </span>
                    </div>

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
                        <ThemeToggle />
                        <Link to="/login">
                            <Button variant="outline"
                                className="rounded-full w-10 h-10 shadow-md">
                                <LuLogIn />
                            </Button>
                        </Link>
                    </div>
                </Menu>
            </div>


        </div>
    );
}
