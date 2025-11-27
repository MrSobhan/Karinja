import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiSearch, FiEye, FiHeart, FiMessageCircle } from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useAxios from "@/hooks/useAxios";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
    "پیش نویس",
    "منتشر شده",
    "آرشیو شده",
];

const emptyFilterState = {
    title: "",
    status: "",
};

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

const BlogsList = () => {
    const axiosInstance = useAxios();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [formFilters, setFormFilters] = useState(emptyFilterState);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [filtersApplied, setFiltersApplied] = useState(false);
    const controllerRef = useRef(null);

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
        document.title = "لیست وبلاگ‌ها | کاراینجا";
    }, []);

    useEffect(() => {
        setFormFilters(queryFilters);
    }, [queryFilters]);

    useEffect(() => {
        if (!filtersApplied) return;

        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        const controller = new AbortController();
        controllerRef.current = controller;

        const filterParams = Object.fromEntries(
            Object.entries(queryFilters).filter(([key, value]) => value !== "" && value !== null && value !== undefined)
        );

        const fetchBlogs = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await axiosInstance.get("/blogs/search/", {
                    params: {
                        ...filterParams,
                        operator: "and",
                        offset: 0,
                        limit: 100,
                    },
                    signal: controller.signal,
                });
                const rawData = response?.data;
                const list = Array.isArray(rawData)
                    ? rawData
                    : Array.isArray(rawData?.results)
                    ? rawData.results
                    : [];

                setBlogs(list);
            } catch (err) {
                if (err.name === "CanceledError" || err.name === "AbortError") return;
                setError("در دریافت نتایج جستجو خطایی رخ داد. لطفاً دوباره تلاش کنید.");
                setBlogs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();

        return () => controller.abort();
    }, [queryFilters, filtersApplied]);

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
            if (value !== "") {
                paramsObject[key] = value;
            }
        });
        setSearchParams(paramsObject);
        setFiltersApplied(true);
    };

    const handleResetFilters = () => {
        setFormFilters(emptyFilterState);
        setSearchParams({});
        setBlogs([]);
        setFiltersApplied(false);
        setError("");
        setLoading(false);
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
        () => Object.entries(queryFilters).filter(([, value]) => value !== ""),
        [queryFilters]
    );

    const renderSkeletons = () =>
        Array.from({ length: 6 }).map((_, idx) => (
            <Card key={`skeleton-${idx}`} className="border border-dashed">
                <CardHeader className="space-y-2">
                    <Skeleton className="h-5 w-32 ml-auto" />
                    <Skeleton className="h-6 w-56 ml-auto" />
                    <Skeleton className="h-4 w-40 ml-auto" />
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-8 w-32" />
                </CardFooter>
            </Card>
        ));

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#f7f7f7] dark:bg-background pt-10 lg:pt-28 pb-16">
                <section className="container px-4 mx-auto space-y-8" dir="rtl">
                    <header className="bg-white/80 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-white/10 shadow-sm p-6 backdrop-blur">
                        <div className="flex flex-col gap-2 mb-8">
                            <p className="text-xs text-muted-foreground dana">صفحه وبلاگ‌ها</p>
                            <h1 className="text-2xl md:text-3xl font-bold moraba text-zinc-900 dark:text-white">
                                وبلاگ‌ها و مقالات
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                مقالات و مطالب مفید در زمینه اشتغال و کسب‌وکار
                            </p>
                        </div>
                        {/* --- FILTER FORM --- */}
                        <form
                            onSubmit={handleSubmit}
                            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                        >
                            <div className="flex flex-col gap-2">
                                <label htmlFor="title" className="text-xs text-muted-foreground">
                                    جستجوی عنوان
                                </label>
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formFilters.title}
                                        onChange={handleInputChange}
                                        placeholder="عنوان مقاله را جستجو کنید..."
                                        className="pl-10 text-right"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs text-muted-foreground">وضعیت</label>
                                <Select
                                    value={formFilters.status || "all"}
                                    onValueChange={value => handleSelectChange("status", value === "all" ? "" : value)}
                                >
                                    <SelectTrigger className="justify-between">
                                        <SelectValue placeholder="همه وضعیت‌ها" />
                                    </SelectTrigger>
                                    <SelectContent className="rtl max-h-64">
                                        <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                                        {STATUS_OPTIONS.map(status => (
                                            <SelectItem value={status} key={status}>
                                                {status}
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
                                    جستجو
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
                                            {key === "title" ? "عنوان" : "وضعیت"}:
                                        </span>
                                        <span className="font-medium">{value}</span>
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
                                        {loading ? "..." : blogs.length}
                                    </span>
                                    مقاله
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-2xl border border-red-200 bg-red-50 text-red-600 dark:border-red-400 dark:bg-red-900/10 dark:text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        {!filtersApplied ? (
                            <Card className="border border-dashed">
                                <CardContent className="py-12 text-center space-y-4">
                                    <FiSearch className="w-8 h-8 mx-auto text-zinc-400" />
                                    <p className="text-lg font-semibold">برای مشاهده نتایج، ابتدا فیلترها را اعمال کنید</p>
                                    <p className="text-sm text-muted-foreground">
                                        لطفاً ابتدا با انتخاب فیلتر و زدن دکمه جستجو به جستجوی مقاله‌ها بپردازید.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : loading ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{renderSkeletons()}</div>
                        ) : blogs.length === 0 ? (
                            <Card className="border border-dashed">
                                <CardContent className="py-12 text-center space-y-4">
                                    <FiSearch className="w-8 h-8 mx-auto text-zinc-400" />
                                    <p className="text-lg font-semibold">هیچ مقاله‌ای پیدا نشد</p>
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
                                {blogs.map(blog => {
                                    const publishedDate = formatPersianDate(blog.published_at || blog.created_at);
                                    const authorName = blog.user?.full_name || blog.user?.username || "ناشناس";
                                    return (
                                        <Card
                                            key={blog.id}
                                            className="border border-zinc-200/60 dark:border-white/10 shadow-sm hover:shadow-lg transition cursor-pointer"
                                            onClick={() => navigate(`/blog/${blog.id}`)}
                                        >
                                            <CardHeader className="space-y-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <CardTitle className="text-lg font-bold line-clamp-2">
                                                        {blog.title}
                                                    </CardTitle>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>{authorName}</span>
                                                    {publishedDate && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{publishedDate}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3">
                                                    {blog.content?.substring(0, 150) || "بدون توضیحات"}...
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <FiEye className="text-base" />
                                                        <span>{blog.views_count || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <FiHeart className="text-base" />
                                                        <span>{blog.likes_count || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <FiMessageCircle className="text-base" />
                                                        <span>{blog.comments_count || 0}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/blog/${blog.id}`);
                                                    }}
                                                >
                                                    مطالعه بیشتر
                                                </Button>
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

export default BlogsList;

