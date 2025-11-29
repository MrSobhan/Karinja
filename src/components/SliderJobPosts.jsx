import React, { useEffect, useState } from "react";
import CardSlider from "./Slider/Slider";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import useAxios from "@/hooks/useAxios";
import { useNavigate } from "react-router-dom";
import { MdOutlineWorkOutline } from "react-icons/md";
import { FiMapPin, FiBriefcase } from "react-icons/fi";
import { Skeleton } from "@/components/ui/skeleton";
import { BiMessageSquareDetail } from "react-icons/bi";

const STATUS_INTENTS = {
    "فعال":
        "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
    "در انتظار تایید":
        "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
    "در حال بررسی":
        "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
    "رد شده":
        "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700",
    "پایان یافته":
        "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-300 dark:border-zinc-700",
};

const JOB_TYPE_BADGE = {
    "تمام‌وقت":
        "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
    "پاره‌وقت":
        "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700",
    "کارآموزی":
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
    remote:
        "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700",
};

const cn = (...classes) => classes.filter(Boolean).join(" ");

const getStatusClasses = status =>
    STATUS_INTENTS[status] || "bg-gray-100 text-gray-700 border-gray-200";

const getJobTypeClasses = type =>
    JOB_TYPE_BADGE[type] || "bg-slate-100 text-slate-700 border-slate-200";

const formatPersianDate = dateValue => {
    if (!dateValue) return null;
    try {
        const dt = new Date(dateValue);
        if (Number.isNaN(dt.getTime())) return null;
        return new Intl.DateTimeFormat("fa-IR", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(dt);
    } catch {
        return null;
    }
};

function renderSkeletons() {
    return Array.from({ length: 4 }).map((_, idx) => (
        <Card key={`skeleton-${idx}`} className="border border-dashed w-[320px]">
            <CardHeader className="space-y-2">
                <Skeleton className="h-5 w-32 ml-auto" />
                <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-3 w-4/5 mb-1" />
                <Skeleton className="h-3 w-3/4" />
            </CardContent>
            <CardFooter className="flex flex-col gap-3 md:flex-row md:justify-between">
                <Skeleton className="h-3 w-24" />
                {/* <Skeleton className="h-8 w-32" /> */}
            </CardFooter>
        </Card>
    ));
}

export function SliderJobPosts() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const axiosInstance = useAxios();

    useEffect(() => {
        setLoading(true);
        axiosInstance
            .get("/job_postings/")
            .then(res => {
                const rawData = res?.data;
                const list = Array.isArray(rawData)
                    ? rawData
                    : Array.isArray(rawData?.results)
                        ? rawData.results
                        : [];

                setJobs(list);
                setError("");

            })
            .catch(err => {
                setError("خطا در دریافت لیست شغل‌ها");
                setJobs([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <CardSlider title="آگهی‌های استخدامی" href="/jobs/search">
            {loading ? (
                <div className="flex gap-4">{renderSkeletons()}</div>
            ) : error ? (
                <div className="p-8 text-center text-red-500">{error}</div>
            ) : jobs.length === 0 ? (
                <div className="p-8 text-center text-gray-500">آگهی شغلی فعالی وجود ندارد.</div>
            ) : (
                jobs.map(job => {
                    const statusDate = formatPersianDate(job.created_at);
                    const companyName = job.company?.full_name || job.company_name;
                    return (
                        <Card
                            key={job.id}
                            className="border border-zinc-200/60 dark:border-white/10 shadow-sm hover:shadow-lg transition w-[270px] sm:w-[320px] cursor-pointer rounded-2xl bg-white dark:bg-black px-0 py-0 overflow-hidden"
                            onClick={() => navigate(`/job/${job.id}`)}
                        >
                            <CardHeader className="flex flex-col gap-3 text-right p-3 sm:p-4 pb-2 bg-white dark:bg-black">
                                <div className="flex justify-between">
                                    <div className="flex flex-col gap-2">
                                        <CardTitle className="text-lg sm:text-xl font-medium  flex items-center gap-1">
                                            <MdOutlineWorkOutline className="text-base sm:text-lg" />
                                            {job.title}
                                        </CardTitle>
                                        <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                                            {companyName || "بدون نام شرکت"}
                                            {job.company?.industry && (
                                                <span className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 ml-2">{job.company.industry}</span>
                                            )}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">{statusDate ? ` ${statusDate}` : ""}</p>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-end">
                                    {job.employment_type && (
                                        <span
                                            className={cn(
                                                "inline-block px-2 py-1 rounded border text-xs",
                                                getJobTypeClasses(job.employment_type)
                                            )}
                                        >
                                            {job.employment_type}
                                        </span>
                                    )}
                                    {job.job_categoriy && (
                                        <span className="text-xs px-2 py-1 font-medium rounded bg-black/10 dark:bg-white/10">
                                            {job.job_categoriy}
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="px-3 sm:px-4 pt-2 pb-4 bg-white dark:bg-black space-y-2" dir="ltr">
                                {/* <div className="text-sm text-zinc-600 dark:text-zinc-300 leading-7 line-clamp-4 min-h-[56px]">
                                    {job.job_description || "برای این آگهی توضیحی ثبت نشده است."}
                                </div> */}
                                <div className="grid gap-2 text-xs text-zinc-500">
                                    <div className="flex items-center gap-1 justify-end">
                                        <span>{job.location || "محل نامشخص"}</span>
                                        <FiMapPin className="text-base sm:text-lg" />
                                    </div>
                                    <div className="flex items-center gap-1 justify-end">
                                        <span>
                                            ظرفیت:{" "}
                                            <strong className="text-zinc-800 dark:text-white">
                                                {job.vacancy_count ?? "نامشخص"}
                                            </strong>
                                        </span>
                                        <FiBriefcase className="text-base font-medium  sm:text-lg" />
                                    </div>
                                    {job.salary_unit && (
                                        <div className="flex items-center gap-1 justify-end">
                                            <strong className="text-zinc-800 dark:text-white font-medium ">
                                                {job.salary_unit} {(job.salary_range ? job.salary_range.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "،") : "نامشخص")}
                                            </strong>
                                            <span>: حقوق پیشنهادی</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>

                        </Card>
                    );
                })
            )}
        </CardSlider>
    );
}
