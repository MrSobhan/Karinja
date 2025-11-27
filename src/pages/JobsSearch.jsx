import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiSearch, FiMapPin, FiBriefcase, FiChevronLeft } from "react-icons/fi";
import { MdOutlineWorkOutline } from "react-icons/md";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { JOB_CATEGORIES, IRAN_PROVINCES } from "@/constants/jobFilters";
import { cn } from "@/lib/utils";
import useAxios from "@/hooks/useAxios";

const STATUS_INTENTS = {
    "فعال": "bg-emerald-50 text-emerald-600 border-emerald-200",
    "در انتظار تایید": "bg-amber-50 text-amber-600 border-amber-200",
    "در حال بررسی": "bg-amber-50 text-amber-600 border-amber-200",
    "رد شده": "bg-rose-50 text-rose-600 border-rose-200",
    "پایان یافته": "bg-zinc-100 text-zinc-600 border-zinc-200",
};

const JOB_TYPE_BADGE = {
    "تمام‌وقت": "bg-blue-50 text-blue-600 border-blue-200",
    "پاره‌وقت": "bg-purple-50 text-purple-600 border-purple-200",
    "کارآموز": "bg-amber-50 text-amber-700 border-amber-200",
    "قراردادی": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "موقت": "bg-pink-50 text-pink-700 border-pink-200",
    "داوطلبانه": "bg-green-50 text-green-700 border-green-200",
    "سایر": "bg-slate-100 text-slate-700 border-slate-200",
    remote: "bg-teal-50 text-teal-700 border-teal-200",
};

const EMPLOYMENT_TYPES = [
    "تمام‌وقت", "پاره‌وقت", "قراردادی", "موقت", "داوطلبانه", "کارآموز", "سایر"
];

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

const emptyFilterState = {
    title: "",
    location: "",
    job_categoriy: "",
    employment_type: "",
};

const filterLabelMap = {
    title: "عنوان",
    location: "استان",
    employment_type: "نوع همکاری",
    job_categoriy: "دسته‌بندی",
};

const JobsSearch = () => {
    const axiosInstance = useAxios();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [formFilters, setFormFilters] = useState(emptyFilterState);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    // This flag is used to avoid fetching data on the first render

    // sync filter state from url params -> only allowed keys
    const queryFilters = useMemo(() => {
        const nextFilters = { ...emptyFilterState };
        searchParams.forEach((value, key) => {
            if (key in nextFilters) {
                nextFilters[key] = value;
            }
        });
        return nextFilters;
    }, [searchParams]);

    // Set document title once
    useEffect(() => {
        document.title = "جستجوی فرصت‌های شغلی | کاراینجا";
    }, []);

    // Whenever url params change, sync form with the params
    useEffect(() => {
        setFormFilters(queryFilters);
    }, [queryFilters]);

    // Whenever formFilters are manually set (by form/badge), the user can click the search button to fire search.
    // So don't do useEffect(fetch) on mount.

    const fetchJobs = async filterParams => {
        setLoading(true);
        setError("");
        try {
            const response = await axiosInstance.get("/job_postings/search/", {
                params: {
                    ...filterParams,
                    operator: "and",
                    offset: 0,
                    limit: 100,
                },
            });
            const rawData = response?.data;
            const list = Array.isArray(rawData)
                ? rawData
                : Array.isArray(rawData?.results)
                    ? rawData.results
                    : [];
            setJobs(list);
        } catch (err) {
            if (err.name === "CanceledError") return;
            setError("در دریافت نتایج جستجو خطایی رخ داد. لطفاً دوباره تلاش کنید.");
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    // Called ONLY by Search form submit
    const handleSubmit = event => {
        event.preventDefault();
        const paramsObject = {};
        Object.entries(formFilters).forEach(([key, value]) => {
            if (value !== "") {
                paramsObject[key] = value;
            }
        });
        setSearchParams(paramsObject);
        // Run search
        setHasSearched(true);
        fetchJobs(paramsObject);
    };

    // On mount: do nothing (hasSearched=false). 
    // Only allow search after search button
    // When filters are reset/removed, clear jobs and params
    const handleResetFilters = () => {
        setFormFilters(emptyFilterState);
        setSearchParams({});
        setJobs([]);
        setError("");
        setHasSearched(false);
    };

    // Remove a filter and re-run search if already has searched
    const handleRemoveFilter = key => {
        const nextFilters = { ...queryFilters };
        delete nextFilters[key];
        setFormFilters(prev => ({ ...prev, [key]: "" }));
        setSearchParams(
            Object.fromEntries(
                Object.entries(nextFilters).filter(([, value]) => Boolean(value))
            )
        );
        // If there was a previous search, do update jobs list, else just do nothing
        if (hasSearched) {
            fetchJobs(
                Object.fromEntries(
                    Object.entries(nextFilters).filter(([, value]) => Boolean(value))
                )
            );
        }
    };

    const handleInputChange = event => {
        const { name, value } = event.target;
        setFormFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormFilters(prev => ({ ...prev, [name]: value }));
    };

    const activeFilterEntries = useMemo(
        () => Object.entries(queryFilters).filter(([, value]) => value !== ""),
        [queryFilters]
    );

    const renderFilterLabel = (key, value) => {
        if (key === "job_categoriy") {
            return JOB_CATEGORIES.find(cat => cat.value === value)?.label || value;
        }
        if (key === "location") {
            return IRAN_PROVINCES.find(city => city.value === value)?.label || value;
        }
        if (key === "employment_type") {
            return value;
        }
        if (key === "title") {
            return `عنوان: ${value}`;
        }
        return value;
    };

    const renderSkeletons = () =>
        Array.from({ length: 4 }).map((_, idx) => (
            <Card key={`skeleton-${idx}`} className="border border-dashed">
                <CardHeader className="space-y-2">
                    <Skeleton className="h-5 w-32 ml-auto" />
                    <Skeleton className="h-6 w-56 ml-auto" />
                    <Skeleton className="h-4 w-40 ml-auto" />
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex gap-2 justify-end">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-32" />
                </CardFooter>
            </Card>
        ));

    const badgeLabelForFilter = key => filterLabelMap[key] || key;

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#f7f7f7] dark:bg-background pt-10 lg:pt-28 pb-16">
                <section className="container px-4 mx-auto space-y-8" dir="rtl">
                    <header className="bg-white/80 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-white/10 shadow-sm p-6 backdrop-blur">
                        <div className="flex flex-col gap-2 mb-8">
                            <p className="text-xs text-muted-foreground dana">صفحه نتایج جستجو</p>
                            <h1 className="text-2xl md:text-3xl font-bold moraba text-zinc-900 dark:text-white">
                                پیدا کردن فرصت شغلی مناسب شما
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                نتایج مطابق با فیلترهای انتخابی شما نمایش داده می‌شود. می‌توانید
                                شرط‌های جدید اضافه یا همه را حذف کنید.
                            </p>
                        </div>
                        {/* --- FILTER FORM --- */}
                        <form
                            onSubmit={handleSubmit}
                            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                        >
                            <div className="flex flex-col gap-2">
                                <label htmlFor="title" className="text-xs text-muted-foreground">
                                    عنوان شغلی یا نام شرکت
                                </label>
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formFilters.title}
                                        onChange={handleInputChange}
                                        placeholder="طراح محصول، توسعه‌دهنده ..."
                                        className="pl-10 text-right"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs text-muted-foreground">استان</label>
                                <Select
                                    value={formFilters.location}
                                    onValueChange={value => handleSelectChange("location", value)}
                                >
                                    <SelectTrigger className="justify-between">
                                        <SelectValue placeholder="همه استان‌ها" />
                                    </SelectTrigger>
                                    <SelectContent className="rtl max-h-72">
                                        {IRAN_PROVINCES.map(city => (
                                            <SelectItem value={city.value} key={city.value}>
                                                {city.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs text-muted-foreground">
                                    دسته‌بندی شغلی
                                </label>
                                <Select
                                    value={formFilters.job_categoriy}
                                    onValueChange={value => handleSelectChange("job_categoriy", value)}
                                >
                                    <SelectTrigger className="justify-between">
                                        <SelectValue placeholder="انتخاب دسته‌بندی" />
                                    </SelectTrigger>
                                    <SelectContent className="rtl max-h-64">
                                        {JOB_CATEGORIES.map(cat => (
                                            <SelectItem value={cat.value} key={cat.value}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs text-muted-foreground">نوع همکاری</label>
                                <Select
                                    value={formFilters.employment_type}
                                    onValueChange={value => handleSelectChange("employment_type", value)}
                                >
                                    <SelectTrigger className="justify-between">
                                        <SelectValue placeholder="نوع همکاری" />
                                    </SelectTrigger>
                                    <SelectContent className="rtl max-h-48">
                                        {EMPLOYMENT_TYPES.map(type => (
                                            <SelectItem value={type} key={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-start w-full gap-3">
                                <Button type="submit" className="flex-1 h-11 flex items-center justify-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                                        />
                                    </svg>
                                    جستجوی مشاغل
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-sm flex items-center gap-1 text-muted-foreground hover:text-red-500 transition"
                                    onClick={handleResetFilters}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    حذف فیلترها
                                </Button>
                            </div>
                        </form>
                        {/* --- FILTER BADGES --- */}
                        {activeFilterEntries.length > 0 && (
                            <div className="flex flex-wrap gap-3 mt-6">
                                {activeFilterEntries.map(([key, value]) => (
                                    <Badge
                                        key={`${key}-${value}`}
                                        variant="outline"
                                        className="flex items-center gap-2 border-dashed"
                                    >
                                        <span className="text-xs text-muted-foreground">
                                            {badgeLabelForFilter(key)}:
                                        </span>
                                        <span className="font-medium">{renderFilterLabel(key, value)}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFilter(key)}
                                            className="text-xs text-zinc-500 hover:text-red-500 transition"
                                            aria-label={`حذف فیلتر ${key}`}
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </header>

                    <section className="space-y-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-3 flex gap-x-2">
                                    نتایج یافت‌شده:
                                    <span className="font-bold text-zinc-900 dark:text-white">
                                        {/* Only after searching, show count. Otherwise, show nothing */}
                                        {loading ? "..." : hasSearched ? jobs.length : "۰"}
                                    </span>
                                    آگهی شغلی
                                </p>
                                {/* {activeFilterEntries.length > 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        فیلترهای فعال :  {" "}
                                        {activeFilterEntries
                                            .map(([key, value]) => renderFilterLabel(key, value))
                                            .join("، ")}
                                    </p>
                                )} */}
                            </div>
                            {/* <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                className="self-start md:self-auto"
                            >
                                بازگشت به بالا
                                <FiChevronLeft />
                            </Button> */}
                        </div>

                        {error && (
                            <div className="p-4 rounded-2xl border border-red-200 bg-red-50 text-red-600 dark:border-red-400 dark:bg-red-900/10 dark:text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="grid gap-4">{renderSkeletons()}</div>
                        ) : !hasSearched ? (
                            <Card className="border border-dashed">
                                <CardContent className="py-12 text-center space-y-4">
                                    <FiSearch className="w-8 h-8 mx-auto text-zinc-400" />
                                    <p className="text-lg font-semibold">هنوز جستجویی انجام نشده است</p>
                                    <p className="text-sm text-muted-foreground">
                                        فیلترها را وارد کنید و روی جستجو بزنید.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : jobs.length === 0 ? (
                            <Card className="border border-dashed">
                                <CardContent className="py-12 text-center space-y-4">
                                    <FiSearch className="w-8 h-8 mx-auto text-zinc-400" />
                                    <p className="text-lg font-semibold">هیچ آگهی مطابق جستجو پیدا نشد</p>
                                    <p className="text-sm text-muted-foreground">
                                        فیلترها را تغییر دهید یا کلمات کلیدی عمومی‌تر امتحان کنید.
                                    </p>
                                    <Button variant="outline" onClick={handleResetFilters}>
                                        حذف همه فیلترها
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {jobs.map(job => {
                                    const statusDate = formatPersianDate(job.posted_date);
                                    const companyName = job.company?.full_name || job.company_name;
                                    return (
                                        <Card
                                            key={job.id}
                                            className="border border-zinc-200/60 dark:border-white/10 shadow-sm hover:shadow-lg transition"
                                        >
                                            <CardHeader className="flex flex-col gap-3 text-right">
                                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                                    <div className="space-y-1">
                                                        <CardTitle className="text-xl font-bold">
                                                            {job.title}
                                                        </CardTitle>
                                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                            <MdOutlineWorkOutline className="text-lg" />
                                                            {companyName || "بدون نام شرکت"}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 justify-end">
                                                        {job.status && (
                                                            <Badge
                                                                variant="outline"
                                                                className={cn(
                                                                    getStatusClasses(job.status),
                                                                    "border"
                                                                )}
                                                            >
                                                                {job.status}
                                                            </Badge>
                                                        )}
                                                        {job.employment_type && (
                                                            <Badge
                                                                variant="outline"
                                                                className={cn(
                                                                    getJobTypeClasses(job.employment_type),
                                                                    "border"
                                                                )}
                                                            >
                                                                {job.employment_type}
                                                            </Badge>
                                                        )}
                                                        {job.job_categoriy && (
                                                            <Badge variant="secondary">
                                                                {job.job_categoriy}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4 text-right">
                                                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-7 line-clamp-4">
                                                    {job.job_description || "برای این آگهی توضیحی ثبت نشده است."}
                                                </p>
                                                <div className="grid gap-3 text-sm text-zinc-500">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <FiMapPin className="text-lg" />
                                                        <span>{job.location || "محل نامشخص"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-end gap-2">
                                                        <FiBriefcase className="text-lg" />
                                                        <span>
                                                            ظرفیت:{" "}
                                                            <strong className="text-zinc-800 dark:text-white">
                                                                {job.vacancy_count ?? "نامشخص"}
                                                            </strong>
                                                        </span>
                                                    </div>
                                                    {job.salary_unit && (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <span>حقوق پیشنهادی:</span>
                                                            <strong className="text-zinc-800 dark:text-white">
                                                                {job.salary_range || "نامشخص"}{" "}
                                                                {job.salary_unit}
                                                            </strong>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                            <CardFooter className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                <div className="text-xs text-muted-foreground">
                                                    {statusDate ? `منتشر شده در ${statusDate}` : "تاریخ انتشار نامشخص"}
                                                </div>
                                                <div className="flex w-full md:w-auto gap-2 flex-wrap">
                                                    <Button
                                                        className="flex-1 md:flex-none"
                                                        onClick={() => navigate(`/job/${job.id}`)}
                                                    >
                                                        مشاهده آگهی
                                                    </Button>
                                                    {job.company?.id && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="flex-1 md:flex-none"
                                                            onClick={() => navigate(`/company/${job.company.id}`)}
                                                        >
                                                            مشاهده شرکت
                                                        </Button>
                                                    )}
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="flex-1 md:flex-none"
                                                        onClick={() => window.open(`tel:${job.company?.phone || ""}`, "_self")}
                                                        disabled={!job.company?.phone}
                                                    >
                                                        تماس با شرکت
                                                    </Button>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default JobsSearch;
