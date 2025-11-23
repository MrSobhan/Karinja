import React, { useEffect, useState } from "react";
import CardSlider from "./Slider/Slider";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import useAxios from "@/hooks/useAxios";

import { FaPhoenixFramework } from "react-icons/fa6";
import { IoIosGitNetwork } from "react-icons/io";
import { MdOutlineNumbers } from "react-icons/md";
import { CiCalendarDate } from "react-icons/ci";
import { IoPlanetOutline } from "react-icons/io5";

import { useNavigate } from "react-router-dom";


// Skeleton loader component for company cards
function CompanyCardSkeleton() {
    return (
        <Card
            className="w-[320px] rounded-2xl bg-white dark:bg-black border-0 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_0_rgba(255,255,255,0.03)] animate-pulse"
        >
            <CardHeader className="p-5 flex-row items-center gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                    <div>
                        <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded mt-2 mb-1" />
                        <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                    <div className="h-4 w-14 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-4 w-10 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
                <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </CardContent>
        </Card>
    );
}

export function SliderCompany() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const axiosInstance = useAxios();

    useEffect(() => {
        setLoading(true);
        axiosInstance
            .get("/employer_companies/")
            .then(res => {
                setCompanies(res.data || []);
                setError("");
            })
            .catch(() => {
                setError("خطا در دریافت لیست شرکت‌ها");
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <CardSlider title="شرکت‌های برگزیده" href="/companies">
            {loading ? (
                <>
                    {/* Skeleton style exactly like JobsSearch.jsx cards */}
                    {[...Array(4)].map((_, idx) => (
                        <CompanyCardSkeleton key={idx} />
                    ))}
                </>
            ) : error ? (
                <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-200 text-sm">
                    {error}
                </div>
            ) : companies.length === 0 ? (
                <Card className="border border-dashed">
                    <CardContent className="py-12 text-center space-y-4">
                        <span className="text-zinc-400">
                            {/* Search icon */}
                            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-3.8-3.8"></path>
                            </svg>
                        </span>
                        <p className="text-lg font-semibold">شرکتی یافت نشد</p>
                        <p className="text-sm text-muted-foreground">شرکت برگزیده‌ای ثبت نشده است.</p>
                    </CardContent>
                </Card>
            ) : (
                companies.map(company => (
                    <Card
                        key={company.id}
                        className={`
                            w-[320px] cursor-pointer rounded-2xl
                            bg-white dark:bg-black
                            transition shadow-sm hover:shadow-lg
                            overflow-hidden
                            border border-zinc-200/60 dark:border-white/10
                        `}
                        onClick={() => navigate(`/company/${company.id}`)}
                    >
                        <CardHeader className="p-5 flex-row items-center gap-3 bg-white dark:bg-black">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-black dark:bg-white flex items-center justify-center">
                                    <span className="text-white dark:text-black text-2xl font-extrabold">
                                        {/* Company Icon Placeholder */}
                                        <FaPhoenixFramework />
                                    </span>
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold text-black dark:text-white tracking-tight">
                                        {company.full_name}
                                    </CardTitle>
                                    {company.industry && (
                                        <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-1">
                                            {company.industry}
                                        </CardDescription>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="text-xs flex flex-wrap gap-x-2 gap-y-1 items-center text-black dark:text-white">
                                {company.ownership_type && (
                                    <span className="bg-black/5 dark:bg-white/5 rounded-lg p-2 text-xs mt-2 flex items-center justify-center gap-1">
                                        <IoIosGitNetwork />
                                       نوع کار  {company.ownership_type}
                                    </span>
                                )}
                                {company.employee_count && (
                                    <span className="bg-black/5 dark:bg-white/5 rounded-lg p-2 text-xs mt-2 flex items-center justify-center gap-1">
                                        <MdOutlineNumbers />
                                        تعداد کارکنان شرکت {company.employee_count}
                                    </span>
                                )}
                                {company.founded_year && (
                                    <span className="bg-black/5 dark:bg-white/5 rounded-lg p-2 text-xs mt-2 flex items-center justify-center gap-1">
                                        <CiCalendarDate />
                                        تاسیس {company.founded_year}
                                    </span>
                                )}
                                {company.website_address && (
                                    <a
                                        href={company.website_address.startsWith('http') ? company.website_address : `https://${company.website_address}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-black/5 dark:bg-white/5 rounded-lg p-2 text-xs mt-2 flex items-center justify-center gap-1 underline text-black dark:text-white transition-colors"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <IoPlanetOutline />
                                        سایت
                                    </a>
                                )}
                            </div>
                            <div className="text-sm text-black dark:text-white line-clamp-3">
                                {company.summary || company.description || (
                                    <span className="italic text-neutral-400 dark:text-neutral-600">توضیحی وارد نشده</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </CardSlider>
    );
}
