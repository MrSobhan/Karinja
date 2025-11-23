import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiSearch, FiMapPin, FiChevronLeft, FiBriefcase, FiUsers, FiCalendar, FiGlobe } from "react-icons/fi";
import { MdOutlineBusiness, MdOutlineFactory } from "react-icons/md";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { IRAN_PROVINCES } from "@/constants/jobFilters";
import { cn } from "@/lib/utils";
import useAxios from "@/hooks/useAxios";

const INDUSTRIES = [
    "کشاورزی",
    "دامداری",
    "شیلات",
    "معادن",
    "جنگلداری",
    "صنایع تولیدی",
    "صنایع ساخت‌وساز",
    "صنایع شیمیایی",
    "صنایع انرژی",
    "خدمات تجاری",
    "خدمات مالی",
    "خدمات بهداشتی",
    "خدمات آموزشی",
    "خدمات ارتباطی",
    "گردشگری و تفریحی",
    "فناوری اطلاعات",
    "تحقیق و توسعه",
    "مشاوره و خدمات حرفه‌ای",
    "آموزش‌های پیشرفته و تخصصی",
    "خدمات مدیریت عالی",
    "آموزش‌های عالی و تخصصی",
    "مراقبت‌های پزشکی تخصصی",
    "هنر و فرهنگ",
    "تحقیقات و نوآوری‌های پیشرفته",
    "سایر",
];

const OWNERSHIP_TYPES = [
    "خصوصی",
    "عمومی",
    "تعاونی",
    "مختلط",
    "دولتی",
    "بخش خصوصی",
    "مشارکت عمومی-خصوصی",
    "غیرانتفاعی",
    "شرکتی",
];

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
    full_name: "",
    industry: "",
    ownership_type: "",
};

const CompaniesList = () => {
    const axiosInstance = useAxios();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [formFilters, setFormFilters] = useState(emptyFilterState);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const queryFilters = useMemo(() => {
        const nextFilters = { ...emptyFilterState };
        searchParams.forEach((value, key) => {
            if (key in nextFilters) {
                nextFilters[key] = value;
            }
        });
        return nextFilters;
    }, [searchParams]);

    useEffect(() => {
        document.title = "لیست شرکت‌ها | کاراینجا";
    }, []);

    useEffect(() => {
        setFormFilters(queryFilters);
    }, [queryFilters]);

    useEffect(() => {
        const controller = new AbortController();
        const activeParams = Object.fromEntries(
            Object.entries(queryFilters).filter(([, value]) => Boolean(value))
        );

        const fetchCompanies = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await axiosInstance.get("/employer_companies/", {
                    params: activeParams,
                    signal: controller.signal,
                });
                const rawData = response?.data;
                const list = Array.isArray(rawData)
                    ? rawData
                    : Array.isArray(rawData?.results)
                        ? rawData.results
                        : [];
                setCompanies(list);
            } catch (err) {
                if (err.name === "CanceledError") return;
                setError("در دریافت نتایج جستجو خطایی رخ داد. لطفاً دوباره تلاش کنید.");
                setCompanies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();

        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryFilters]);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setFormFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = event => {
        event.preventDefault();
        const paramsObject = {};
        Object.entries(formFilters).forEach(([key, value]) => {
            if (value) {
                paramsObject[key] = value;
            }
        });
        setSearchParams(paramsObject);
    };

    const handleResetFilters = () => {
        setFormFilters(emptyFilterState);
        setSearchParams({});
    };

    const handleRemoveFilter = key => {
        const nextFilters = { ...queryFilters };
        delete nextFilters[key];
        setSearchParams(
            Object.fromEntries(
                Object.entries(nextFilters).filter(([, value]) => Boolean(value))
            )
        );
    };

    const activeFilterEntries = useMemo(
        () => Object.entries(queryFilters).filter(([, value]) => Boolean(value)),
        [queryFilters]
    );

    const renderFilterLabel = (key, value) => {
        if (key === "industry") {
            return value;
        }
        if (key === "ownership_type") {
            return value;
        }
        if (key === "full_name") {
            return `نام: ${value}`;
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
            </Card>
        ));

    const badgeLabelForFilter = key => {
        if (key === "full_name") return "نام شرکت";
        if (key === "industry") return "صنعت";
        if (key === "ownership_type") return "نوع مالکیت";
        return key;
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#f7f7f7] dark:bg-background pt-28 pb-16">
                <section className="container px-4 mx-auto space-y-8" dir="rtl">
                    <header className="bg-white/80 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-white/10 shadow-sm p-6 backdrop-blur">
                        <div className="flex flex-col gap-2 mb-8">
                            <p className="text-xs text-muted-foreground dana">صفحه نتایج جستجو</p>
                            <h1 className="text-2xl md:text-3xl font-bold moraba text-zinc-900 dark:text-white">
                                پیدا کردن شرکت مناسب
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                نتایج مطابق با فیلترهای انتخابی شما نمایش داده می‌شود. می‌توانید
                                شرط‌های جدید اضافه یا همه را حذف کنید.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                        >
                            <div className="flex flex-col gap-2">
                                <label htmlFor="full_name" className="text-xs text-muted-foreground">
                                    نام شرکت
                                </label>
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <Input
                                        id="full_name"
                                        name="full_name"
                                        value={formFilters.full_name}
                                        onChange={handleInputChange}
                                        placeholder="نام شرکت را جستجو کنید..."
                                        className="pl-10 text-right"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs text-muted-foreground">
                                    صنعت
                                </label>
                                <Select
                                    value={formFilters.industry}
                                    onValueChange={value => handleSelectChange("industry", value)}
                                >
                                    <SelectTrigger className="justify-between">
                                        <SelectValue placeholder="انتخاب صنعت" />
                                    </SelectTrigger>
                                    <SelectContent className="rtl max-h-64">
                                        {INDUSTRIES.map(industry => (
                                            <SelectItem value={industry} key={industry}>
                                                {industry}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs text-muted-foreground">نوع مالکیت</label>
                                <Select
                                    value={formFilters.ownership_type}
                                    onValueChange={value => handleSelectChange("ownership_type", value)}
                                >
                                    <SelectTrigger className="justify-between">
                                        <SelectValue placeholder="انتخاب نوع مالکیت" />
                                    </SelectTrigger>
                                    <SelectContent className="rtl max-h-72">
                                        {OWNERSHIP_TYPES.map(type => (
                                            <SelectItem value={type} key={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-end gap-3">
                                <Button type="submit" className="flex-1 h-11">
                                    جستجوی شرکت‌ها
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-xs"
                                    onClick={handleResetFilters}
                                >
                                    حذف فیلترها
                                </Button>
                            </div>
                        </form>

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
                                <p className="text-sm text-muted-foreground">
                                    نتایج یافت‌شده:
                                    <span className="font-bold text-zinc-900 dark:text-white mr-2">
                                        {loading ? "..." : companies.length}
                                    </span>
                                    شرکت
                                </p>
                                {activeFilterEntries.length > 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        فیلترهای فعال:{" "}
                                        {activeFilterEntries
                                            .map(([key, value]) => renderFilterLabel(key, value))
                                            .join("، ")}
                                    </p>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                className="self-start md:self-auto"
                            >
                                بازگشت به بالا
                                <FiChevronLeft />
                            </Button>
                        </div>

                        {error && (
                            <div className="p-4 rounded-2xl border border-red-200 bg-red-50 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="grid gap-4">{renderSkeletons()}</div>
                        ) : companies.length === 0 ? (
                            <Card className="border border-dashed">
                                <CardContent className="py-12 text-center space-y-4">
                                    <FiSearch className="w-8 h-8 mx-auto text-zinc-400" />
                                    <p className="text-lg font-semibold">هیچ شرکتی مطابق جستجو پیدا نشد</p>
                                    <p className="text-sm text-muted-foreground">
                                        فیلترها را تغییر دهید یا کلمات کلیدی عمومی‌تر امتحان کنید.
                                    </p>
                                    <Button variant="outline" onClick={handleResetFilters}>
                                        حذف همه فیلترها
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {companies.map(company => {
                                    const createdDate = formatPersianDate(company.created_at);
                                    return (
                                        <Card
                                            key={company.id}
                                            className="border border-zinc-200/60 dark:border-white/10 shadow-sm hover:shadow-lg transition cursor-pointer"
                                            onClick={() => navigate(`/company/${company.id}`)}
                                        >
                                            <CardHeader className="flex-row items-start gap-3">
                                                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-black dark:bg-white flex items-center justify-center">
                                                    <MdOutlineBusiness className="text-white dark:text-black text-2xl" />
                                                </div>
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg font-bold mb-1">
                                                        {company.full_name}
                                                    </CardTitle>
                                                    {company.industry && (
                                                        <CardDescription className="text-sm">
                                                            {company.industry}
                                                        </CardDescription>
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {company.summary && (
                                                    <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3">
                                                        {company.summary}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap gap-2 text-xs">
                                                    {company.ownership_type && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            <FiBriefcase className="ml-1 text-xs" />
                                                            {company.ownership_type}
                                                        </Badge>
                                                    )}
                                                    {company.employee_count && (
                                                        <Badge variant="outline" className="text-xs">
                                                            <FiUsers className="ml-1 text-xs" />
                                                            {company.employee_count}
                                                        </Badge>
                                                    )}
                                                    {company.founded_year && (
                                                        <Badge variant="outline" className="text-xs">
                                                            <FiCalendar className="ml-1 text-xs" />
                                                            {company.founded_year}
                                                        </Badge>
                                                    )}
                                                    {company.website_address && (
                                                        <Badge variant="outline" className="text-xs">
                                                            <FiGlobe className="ml-1 text-xs" />
                                                            وب‌سایت
                                                        </Badge>
                                                    )}
                                                </div>
                                                {createdDate && (
                                                    <p className="text-xs text-muted-foreground">
                                                        ثبت شده در {createdDate}
                                                    </p>
                                                )}
                                            </CardContent>
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

export default CompaniesList;

