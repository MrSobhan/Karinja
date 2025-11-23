import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FiMapPin, FiPhone, FiGlobe, FiCalendar, FiUsers, FiArrowRight, FiBriefcase } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdOutlineWorkOutline, MdOutlineBusiness, MdOutlineFactory } from "react-icons/md";
import { IoPlanetOutline } from "react-icons/io5";
import useAxios from "@/hooks/useAxios";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const formatPersianDate = dateValue => {
    if (!dateValue) return null;
    try {
        const dt = new Date(dateValue);
        if (Number.isNaN(dt.getTime())) return null;
        return new Intl.DateTimeFormat("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(dt);
    } catch {
        return null;
    }
};

export default function CompanyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosInstance = useAxios();
    
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingJobs, setLoadingJobs] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        document.title = `اطلاعات شرکت | کاراینجا`;
    }, []);

    useEffect(() => {
        const fetchCompany = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await axiosInstance.get(`/employer_companies/${id}`);
                setCompany(response.data);
                setError("");
            } catch (err) {
                if (err.response?.status === 404) {
                    setError("شرکت مورد نظر یافت نشد.");
                } else {
                    setError("خطا در دریافت اطلاعات شرکت. لطفاً دوباره تلاش کنید.");
                }
                console.error("Company fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCompany();
        }
    }, [id]);

    useEffect(() => {
        const fetchCompanyJobs = async () => {
            if (!company?.id) return;
            
            // First, check if job_postings are already included in company data
            if (Array.isArray(company.job_postings) && company.job_postings.length > 0) {
                setJobs(company.job_postings);
                setLoadingJobs(false);
                return;
            }
            
            // Otherwise, try to fetch from API
            setLoadingJobs(true);
            try {
                const response = await axiosInstance.get(`/job_postings/`, {
                    params: { company_id: company.id }
                });
                const rawData = response?.data;
                const list = Array.isArray(rawData)
                    ? rawData
                    : Array.isArray(rawData?.results)
                        ? rawData.results
                        : [];
                setJobs(list);
            } catch (err) {
                console.error("Jobs fetch error:", err);
                // If API call fails, try to use company.job_postings if available
                if (Array.isArray(company.job_postings)) {
                    setJobs(company.job_postings);
                } else {
                    setJobs([]);
                }
            } finally {
                setLoadingJobs(false);
            }
        };

        if (company?.id) {
            fetchCompanyJobs();
        }
    }, [company]);

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-[#f7f7f7] dark:bg-background pt-28 pb-16" dir="rtl">
                    <div className="container px-4 mx-auto max-w-5xl">
                        <Card className="border border-dashed">
                            <CardHeader>
                                <Skeleton className="h-8 w-64 ml-auto mb-4" />
                                <Skeleton className="h-6 w-48 ml-auto" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-4/6" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                    <Skeleton className="h-32" />
                                    <Skeleton className="h-32" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (error || !company) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-[#f7f7f7] dark:bg-background pt-28 pb-16" dir="rtl">
                    <div className="container px-4 mx-auto max-w-5xl">
                        <Card className="border border-dashed">
                            <CardContent className="py-12 text-center space-y-4">
                                <HiOutlineLocationMarker className="w-12 h-12 mx-auto text-zinc-400" />
                                <p className="text-lg font-semibold">{error || "شرکت یافت نشد"}</p>
                                <Button onClick={() => navigate("/companies")}>
                                    بازگشت به لیست شرکت‌ها
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const createdDate = formatPersianDate(company.created_at);
    const user = company.user || {};

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#f7f7f7] dark:bg-background pt-28 pb-16" dir="rtl">
                <div className="container px-4 mx-auto max-w-5xl space-y-6">
                    {/* Header Section */}
                    <Card className="border border-zinc-200/60 dark:border-white/10 shadow-sm">
                        <CardHeader className="space-y-4">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="flex-shrink-0 h-16 w-16 rounded-xl bg-black dark:bg-white flex items-center justify-center">
                                            <MdOutlineBusiness className="text-white dark:text-black text-3xl" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl md:text-3xl font-bold mb-1">
                                                {company.full_name}
                                            </CardTitle>
                                            {company.industry && (
                                                <CardDescription className="text-lg">
                                                    {company.industry}
                                                </CardDescription>
                                            )}
                                        </div>
                                    </div>
                                    {company.summary && (
                                        <p className="text-zinc-600 dark:text-zinc-300 leading-7 mt-3">
                                            {company.summary}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Company Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Description */}
                            {company.description && (
                                <Card className="border border-zinc-200/60 dark:border-white/10 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MdOutlineFactory className="text-xl" />
                                            درباره شرکت
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="prose prose-sm max-w-none text-zinc-700 dark:text-zinc-300 leading-7 whitespace-pre-wrap">
                                            {company.description}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Company Information */}
                            <Card className="border border-zinc-200/60 dark:border-white/10 shadow-sm">
                                <CardHeader>
                                    <CardTitle>اطلاعات شرکت</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {company.registration_number && (
                                        <div className="flex items-center gap-3">
                                            <MdOutlineBusiness className="text-xl text-muted-foreground" />
                                            <div>
                                                <div className="text-sm text-muted-foreground">شماره ثبت</div>
                                                <div className="font-medium">{company.registration_number}</div>
                                            </div>
                                        </div>
                                    )}
                                    {company.industry && (
                                        <div className="flex items-center gap-3">
                                            <MdOutlineFactory className="text-xl text-muted-foreground" />
                                            <div>
                                                <div className="text-sm text-muted-foreground">صنعت</div>
                                                <div className="font-medium">{company.industry}</div>
                                            </div>
                                        </div>
                                    )}
                                    {company.ownership_type && (
                                        <div className="flex items-center gap-3">
                                            <FiBriefcase className="text-xl text-muted-foreground" />
                                            <div>
                                                <div className="text-sm text-muted-foreground">نوع مالکیت</div>
                                                <div className="font-medium">{company.ownership_type}</div>
                                            </div>
                                        </div>
                                    )}
                                    {company.founded_year && (
                                        <div className="flex items-center gap-3">
                                            <FiCalendar className="text-xl text-muted-foreground" />
                                            <div>
                                                <div className="text-sm text-muted-foreground">سال تأسیس</div>
                                                <div className="font-medium">{company.founded_year}</div>
                                            </div>
                                        </div>
                                    )}
                                    {company.employee_count && (
                                        <div className="flex items-center gap-3">
                                            <FiUsers className="text-xl text-muted-foreground" />
                                            <div>
                                                <div className="text-sm text-muted-foreground">تعداد کارمندان</div>
                                                <div className="font-medium">{company.employee_count}</div>
                                            </div>
                                        </div>
                                    )}
                                    {company.address && (
                                        <div className="flex items-start gap-3">
                                            <FiMapPin className="text-xl text-muted-foreground mt-1" />
                                            <div>
                                                <div className="text-sm text-muted-foreground">آدرس</div>
                                                <div className="font-medium">{company.address}</div>
                                            </div>
                                        </div>
                                    )}
                                    {company.phone && (
                                        <div className="flex items-center gap-3">
                                            <FiPhone className="text-xl text-muted-foreground" />
                                            <div>
                                                <div className="text-sm text-muted-foreground">شماره تماس</div>
                                                <div className="font-medium">{company.phone}</div>
                                            </div>
                                        </div>
                                    )}
                                    {company.website_address && (
                                        <div className="flex items-center gap-3">
                                            <FiGlobe className="text-xl text-muted-foreground" />
                                            <div>
                                                <div className="text-sm text-muted-foreground">وب‌سایت</div>
                                                <a
                                                    href={company.website_address.startsWith('http') 
                                                        ? company.website_address 
                                                        : `https://${company.website_address}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    {company.website_address}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {createdDate && (
                                        <div className="flex items-center gap-3">
                                            <FiCalendar className="text-xl text-muted-foreground" />
                                            <div>
                                                <div className="text-sm text-muted-foreground">تاریخ ثبت</div>
                                                <div className="font-medium">{createdDate}</div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Contact Information */}
                            {user && (
                                <Card className="border border-zinc-200/60 dark:border-white/10 shadow-sm">
                                    <CardHeader>
                                        <CardTitle>اطلاعات تماس</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {user.full_name && (
                                            <div>
                                                <div className="text-sm text-muted-foreground">نام مسئول</div>
                                                <div className="font-medium">{user.full_name}</div>
                                            </div>
                                        )}
                                        {user.email && (
                                            <div>
                                                <div className="text-sm text-muted-foreground">ایمیل</div>
                                                <div className="font-medium">{user.email}</div>
                                            </div>
                                        )}
                                        {user.phone && (
                                            <div>
                                                <div className="text-sm text-muted-foreground">شماره تماس</div>
                                                <div className="font-medium">{user.phone}</div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar - Actions */}
                        <div className="space-y-6">
                            <Card className="border border-zinc-200/60 dark:border-white/10 shadow-sm">
                                <CardHeader>
                                    <CardTitle>اطلاعات</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {company.phone && (
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => window.open(`tel:${company.phone}`, "_self")}
                                        >
                                            <FiPhone className="ml-2" />
                                            تماس با شرکت
                                        </Button>
                                    )}
                                    {company.website_address && (
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => {
                                                const url = company.website_address.startsWith('http')
                                                    ? company.website_address
                                                    : `https://${company.website_address}`;
                                                window.open(url, "_blank");
                                            }}
                                        >
                                            <FiGlobe className="ml-2" />
                                            بازدید از وب‌سایت
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => navigate(`/companies`)}
                                    >
                                        <FiArrowRight />
                                      لیست شرکت‌ها
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Company Job Postings */}
                    {jobs.length > 0 && (
                        <Card className="border border-zinc-200/60 dark:border-white/10 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MdOutlineWorkOutline className="text-xl" />
                                    آگهی‌های استخدامی این شرکت ({jobs.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loadingJobs ? (
                                    <div className="space-y-4">
                                        {Array.from({ length: 3 }).map((_, idx) => (
                                            <Skeleton key={idx} className="h-24 w-full" />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {jobs.map(job => (
                                            <Card
                                                key={job.id}
                                                className="border border-zinc-200/60 dark:border-white/10 cursor-pointer hover:shadow-md transition"
                                                onClick={() => navigate(`/job/${job.id}`)}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-lg mb-1">{job.title}</h3>
                                                            <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                                                                {job.location && (
                                                                    <div className="flex items-center gap-1">
                                                                        <FiMapPin className="text-sm" />
                                                                        {job.location}
                                                                    </div>
                                                                )}
                                                                {job.employment_type && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {job.employment_type}
                                                                    </Badge>
                                                                )}
                                                                {job.job_categoriy && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {job.job_categoriy}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/job/${job.id}`);
                                                            }}
                                                        >
                                                            <FiArrowRight className="mr-2" />
                                                            مشاهده
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

