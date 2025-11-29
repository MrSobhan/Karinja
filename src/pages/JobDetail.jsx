import React, { useEffect, useState, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    FiMapPin,
    FiBriefcase,
    FiCalendar,
    FiArrowRight,
    FiPhone,
    FiGlobe,
    FiHeart,
    FiBookmark,
    FiCheck,
    FiAlertTriangle
} from "react-icons/fi";
import { MdOutlineWorkOutline, MdOutlineDescription } from "react-icons/md";
import { SiCountingworkspro } from "react-icons/si";
import { CiMoneyBill } from "react-icons/ci";
import { MdOutlineMapsHomeWork } from "react-icons/md";
import { CgDetailsMore } from "react-icons/cg";

import { HiOutlineLocationMarker } from "react-icons/hi";
import useAxios from "@/hooks/useAxios";
import AuthContext from "@/context/authContext";
import { cn } from "@/lib/utils";
import { toast, Toaster } from "sonner";

// Simple modal implementation (replace with a true modal lib if needed)
function SimpleModal({ open, onClose, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-full max-w-md p-5 relative">
                <button
                    className="absolute top-2 left-2 text-zinc-600 text-2xl"
                    onClick={onClose}
                    aria-label="بستن"
                >
                    ×
                </button>
                {children}
            </div>
        </div>
    );
}

// Accordion component for about the company section
function SimpleAccordion({ title, children }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-zinc-200/60 dark:border-white/10 rounded-lg">
            <button
                type="button"
                className="w-full flex justify-between items-center px-4 py-3 font-semibold dark:text-white text-zinc-800 text-right focus:outline-none"
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
            >
                <span>{title}</span>
                <svg
                    className={cn("w-5 h-5 transition-transform duration-150", open ? "rotate-180" : "")}
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            {open && (
                <div className="p-4 border-t border-zinc-200/60 dark:border-white/10 mt-0">{children}</div>
            )}
        </div>
    );
}

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
    "کارآموزی": "bg-amber-50 text-amber-700 border-amber-200",
    remote: "bg-teal-50 text-teal-700 border-teal-200",
};

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
            month: "long",
            day: "numeric",
        }).format(dt);
    } catch {
        return null;
    }
};

// Options for the violation report
const REPORT_OPTIONS = [
    "موقعیت شغلی بسته شده و نیروی مورد نظر را جذب کرده است",
    "جعلی بودن",
    "کلاهبرداری، نقض قانون یا وقوع جرم",
    "دسته بندی اشتباه",
    "محتوای اشتباه",
    "محتوای توهین آمیز",
    "سایر",
];

export default function JobDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosInstance = useAxios();

    // States
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [liked, setLiked] = useState(false);
    const [likeId, setLikeId] = useState(null);
    const [likeLoading, setLikeLoading] = useState(false);
    const [resumeModal, setResumeModal] = useState(false);
    const [userResumes, setUserResumes] = useState([]);
    const [resumeLoading, setResumeLoading] = useState(false);
    const [resumeSubmitLoading, setResumeSubmitLoading] = useState(false);
    const [selectedResume, setSelectedResume] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");
    const [applicationSent, setApplicationSent] = useState(false);

    // Similar jobs
    const [relatedJobs, setRelatedJobs] = useState([]);
    const [relatedLoading, setRelatedLoading] = useState(true);

    // Report modal
    const [reportModal, setReportModal] = useState(false);
    const [reportOption, setReportOption] = useState("");
    const [reportDesc, setReportDesc] = useState("");
    const [reportTouched, setReportTouched] = useState(false);
    const [reportSubmit, setReportSubmit] = useState(false);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        document.title = `جزئیات آگهی شغلی | کاراینجا`;
    }, []);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError("");
        setJob(null);

        if (!id) return;
        (async () => {
            try {
                const response = await axiosInstance.get(`/job_postings/${id}`);
                if (!cancelled) setJob(response.data);
            } catch (err) {
                if (!cancelled) {
                    if (err.response?.status === 404) {
                        setError("آگهی شغلی مورد نظر یافت نشد.");
                    } else {
                        setError("خطا در دریافت اطلاعات آگهی شغلی. لطفاً دوباره تلاش کنید.");
                    }
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [id]);

    // Fetch related jobs
    useEffect(() => {
        let cancelled = false;
        setRelatedLoading(true);
        setRelatedJobs([]);
        if (!job) return;

        axiosInstance.get(`/job_postings/search/?job_categoriy=${job.job_categoriy}&operator=and&offset=0&limit=100`)
            .then(res => {
                if (!cancelled && Array.isArray(res.data)) setRelatedJobs(res.data.slice(0, 10));
            })
            .catch((err) => {
                if (!cancelled) setRelatedJobs([]);
                console.log(err);

            })
            .finally(() => {
                if (!cancelled) setRelatedLoading(false);

            });
        return () => { cancelled = true; };
    }, [job, id]);

    useEffect(() => {
        if (!job || !id || !user) {
            setLiked(false);
            setLikeId(null);
            return;
        }
        let cancelled = false;
        setLikeLoading(true);

        axiosInstance.get(`/saved_jobs`)
            .then(res => {
                if (cancelled) return;
                const record = res.data && res.data.length ? res.data[0] : null;
                if (record) {
                    setLiked(true);
                    setLikeId(record.id);
                } else {
                    setLiked(false);
                    setLikeId(null);
                }
            })
            .catch(() => {
                setLiked(false);
                setLikeId(null);
            })
            .finally(() => setLikeLoading(false));
        return () => { cancelled = true; };
    }, [job, id]);

    const fetchResumes = useCallback(async () => {
        if (!user) return;
        setResumeLoading(true);
        try {
            const res = await axiosInstance.get(`/job_seeker_resumes/?user_id=${user.user_id}`);
            setUserResumes(Array.isArray(res.data) ? res.data : []);
        } catch {
            setUserResumes([]);
            toast.error("خطا در دریافت رزومه‌ها");
        } finally {
            setResumeLoading(false);
        }
    }, [axiosInstance]);

    const openResumeModal = () => {
        if (!user) {
            navigate("/login", { replace: true });
            toast.info("لطفاً جهت ارسال رزومه وارد شوید.");
            return;
        }
        setResumeModal(true);
        fetchResumes();
    };

    // Like/unlike (saved_jobs)
    const handleLike = async () => {
        if (!user) {
            navigate("/login", { replace: true });
            toast.info("لطفاً جهت ذخیره وارد شوید.");
            return;
        }
        if (likeLoading) return;
        setLikeLoading(true);
        if (!liked) {
            try {
                const body = {
                    user_id: user.user_id,
                    job_posting_id: id,
                    saved_date: new Date().toISOString(),
                };
                const res = await axiosInstance.post("/saved_jobs/", body);
                toast.success("آگهی ذخیره شد.");
                setLiked(true);
                setLikeId(res.data.id);
            } catch {
                toast.error("خطا در ذخیره آگهی.");
            } finally {
                setLikeLoading(false);
            }
        } else {
            try {
                await axiosInstance.delete(`/saved_jobs/${likeId}`);
                setLiked(false);
                setLikeId(null);
                toast.success("ذخیره آگهی حذف شد.");
            } catch {
                toast.error("خطا در حذف آگهی ذخیره شده.");
            } finally {
                setLikeLoading(false);
            }
        }
    };

    // Send resume (job_applications/)
    const handleSubmitResume = async (e) => {
        e && e.preventDefault();
        if (!selectedResume) {
            toast.error("لطفاً رزومه موردنظر را انتخاب کنید.");
            return;
        }
        setResumeSubmitLoading(true);
        try {
            const body = {
                application_date: new Date().toISOString(),
                status: "ارسال شده",
                cover_letter: coverLetter,
                job_posting_id: id,
                job_seeker_resume_id: selectedResume,
            };
            await axiosInstance.post("/job_applications/", body);

            setResumeModal(false);
            setSelectedResume(null);
            setCoverLetter("");
            setApplicationSent(true);
            toast.success("رزومه شما با موفقیت ارسال شد.");
        } catch {
            toast.error("خطا در ارسال رزومه.");
        } finally {
            setResumeSubmitLoading(false);
        }
    };

    // Violation report
    const handleOpenReportModal = () => {
        setReportOption("");
        setReportDesc("");
        setReportTouched(false);
        setReportSubmit(false);
        setReportModal(true);
    };
    const handleReportSubmit = e => {
        e.preventDefault();
        setReportTouched(true);
        if (!reportOption || !reportDesc.trim()) return;
        setReportSubmit(true);
        setTimeout(() => {
            setReportModal(false);
            setReportSubmit(false);
            toast.success("گزارش شما دریافت شد. با سپاس از همکاری شما.");
        }, 900); // Fake submit delay
    };

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

    if (error || !job) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-[#f7f7f7] dark:bg-background pt-28 pb-16" dir="rtl">
                    <div className="container px-4 mx-auto max-w-5xl">
                        <Card className="border border-dashed">
                            <CardContent className="py-12 text-center space-y-4">
                                <HiOutlineLocationMarker className="w-12 h-12 mx-auto text-zinc-400" />
                                <p className="text-lg font-semibold">{error || "آگهی شغلی یافت نشد"}</p>
                                <Button onClick={() => navigate("/jobs/search")}>
                                    بازگشت به لیست آگهی‌ها
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const postedDate = formatPersianDate(job.posted_date);
    const expiryDate = job.expiry_date;
    const company = job.company || {};

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#f7f7f7] dark:bg-background pt-12 lg:pt-28" dir="rtl">
                <Toaster className="dana" />
                <div className="container px-4 mx-auto max-w-5xl space-y-6">
                    {/* Header Section */}
                    <Card className="border border-zinc-200/60 dark:border-white/10 shadow-sm">
                        <CardHeader className="space-y-4">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-200/20 hidden lg:flex items-center justify-center mr-2">
                                        {company.logo ? (
                                            <img
                                                src={company.logo}
                                                alt={company.full_name || "لوگوی شرکت"}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-zinc-900 dark:text-zinc-100 text-3xl select-none mb-1"><SiCountingworkspro /></span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-2xl md:text-3xl font-bold mb-2 moraba">
                                            {job.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MdOutlineWorkOutline className="text-xl" />
                                            <span className="text-lg font-medium">
                                                {company.full_name || "بدون نام شرکت"}
                                            </span>
                                        </div>
                                        <div className="flex mt-5 gap-x-2 !min-w-max ">
                                            {/* Badges */}
                                            {job.status && (
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        getStatusClasses(job.status),
                                                        "border",
                                                        "dark:bg-zinc-900 dark:text-emerald-300 dark:border-emerald-700"
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
                                                        "border",
                                                        "dark:bg-zinc-900 dark:text-blue-300 dark:border-blue-700"
                                                    )}
                                                >
                                                    {job.employment_type}
                                                </Badge>
                                            )}
                                            {job.job_categoriy && (
                                                <Badge
                                                    variant="secondary"
                                                    className="dark:bg-zinc-800 dark:text-zinc-200"
                                                >
                                                    {job.job_categoriy}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-end items-center -mr-4">
                                        <button
                                            className={cn(
                                                "flex items-center px-2 py-1 rounded-lg border transition focus:ring-2 focus:ring-rose-400 gap-1 text-xs font-medium",
                                                liked
                                                    ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-transparent dark:text-rose-400 dark:border-rose-800"
                                                    : "bg-white border-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
                                                likeLoading && "opacity-70 cursor-not-allowed"
                                            )}
                                            aria-label={liked ? "حذف از ذخیره‌ها" : "ذخیره آگهی"}
                                            title={liked ? "حذف از ذخیره‌ها" : "ذخیره آگهی"}
                                            type="button"
                                            onClick={handleLike}
                                            disabled={likeLoading}
                                        >
                                            <FiHeart
                                                className={cn(
                                                    "transition text-md",
                                                    liked ? "text-rose-500 fill-rose-500" : "text-zinc-400 group-hover:text-rose-500"
                                                )}
                                            />
                                            {liked ? "ذخیره شده" : "ذخیره"}
                                        </button>
                                        <button
                                            className={cn(
                                                "flex items-center px-2 py-1 rounded-lg border transition focus:ring-2 focus:ring-blue-400 gap-1 text-xs font-medium",
                                                "bg-blue-50 border-blue-200 text-blue-600 dark:bg-transparent dark:text-blue-400 dark:border-blue-800"
                                            )}
                                            aria-label="اشتراک‌گذاری موقعیت شغلی"
                                            title="اشتراک‌گذاری موقعیت شغلی"
                                            type="button"
                                            onClick={() => {
                                                const url = window.location.href;
                                                if (navigator.clipboard) {
                                                    navigator.clipboard.writeText(url)
                                                        .then(() => {
                                                            toast.success("لینک اشتراک‌گذاری در کلیپ‌بورد کپی شد!");
                                                        })
                                                        .catch(() => {
                                                            toast.error("کپی لینک با خطا مواجه شد!");
                                                        });
                                                } else {
                                                    // fallback for very old browsers
                                                    const textarea = document.createElement('textarea');
                                                    textarea.value = url;
                                                    document.body.appendChild(textarea);
                                                    textarea.select();
                                                    try {
                                                        document.execCommand('copy');
                                                        toast.success("لینک اشتراک‌گذاری در کلیپ‌بورد کپی شد!");
                                                    } catch {
                                                        toast.error("کپی لینک با خطا مواجه شد!");
                                                    }
                                                    document.body.removeChild(textarea);
                                                }
                                            }}
                                        >
                                            <FiGlobe className="text-md" />
                                            اشتراک‌گذاری
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Job Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Description */}
                            <Card className="border border-zinc-200/60 dark:border-white/10 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 moraba">
                                        <MdOutlineDescription className="text-xl" />
                                        شرح موقعیت شغلی
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-sm max-w-none text-zinc-700 dark:text-zinc-300 leading-7 whitespace-pre-wrap">
                                        {job.job_description || "برای این آگهی توضیحی ثبت نشده است."}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Job Requirements */}
                            {(job.vacancy_count || job.salary_range || job.salary_unit) && (
                                <Card className="border border-zinc-200/60 dark:border-white/10 shadow-sm">
                                    <CardHeader>

                                        <CardTitle className="moraba text-lg font-medium flex items-center gap-2">
                                            <CgDetailsMore className="text-xl text-muted-foreground" />
                                            جزئیات موقعیت شغلی
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {job.location && (
                                            <div className="flex items-center gap-3">
                                                <FiMapPin className="text-xl text-muted-foreground" />
                                                <div>
                                                    <div className="text-sm text-muted-foreground">محل کار</div>
                                                    <div className="font-medium">{job.location}</div>
                                                </div>
                                            </div>
                                        )}
                                        {job.vacancy_count && (
                                            <div className="flex items-center gap-3">
                                                <FiBriefcase className="text-xl text-muted-foreground" />
                                                <div>
                                                    <div className="text-sm text-muted-foreground">ظرفیت</div>
                                                    <div className="font-medium">{job.vacancy_count} نفر</div>
                                                </div>
                                            </div>
                                        )}
                                        {(job.salary_range || job.salary_unit) && (
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl text-muted-foreground"><CiMoneyBill /></span>
                                                <div>
                                                    <div className="text-sm text-muted-foreground">حقوق پیشنهادی</div>
                                                    <div className="font-medium">
                                                        {job.salary_range ? job.salary_range.toLocaleString("fa-IR") : "توافقی"} {job.salary_unit || ""}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {postedDate && (
                                            <div className="flex items-center gap-3">
                                                <FiCalendar className="text-xl text-muted-foreground" />
                                                <div>
                                                    <div className="text-sm text-muted-foreground">تاریخ انتشار</div>
                                                    <div className="font-medium">{postedDate}</div>
                                                </div>
                                            </div>
                                        )}
                                        {expiryDate && (
                                            <div className="flex items-center gap-3">
                                                <FiCalendar className="text-xl text-muted-foreground" />
                                                <div>
                                                    <div className="text-sm text-muted-foreground">تاریخ انقضا</div>
                                                    <div className="font-medium">{expiryDate}</div>
                                                </div>
                                            </div>
                                        )}
                                        {company && (company.full_name || company.summary || company.industry) && (
                                            <div className="mt-4">
                                                <SimpleAccordion title="درباره شرکت">
                                                    <div className="space-y-2">
                                                        {company.full_name && (
                                                            <div>
                                                                <span>نام شرکت: </span>
                                                                {company.full_name}
                                                            </div>
                                                        )}
                                                        {company.industry && (
                                                            <div>
                                                                <span>صنعت: </span>
                                                                {company.industry}
                                                            </div>
                                                        )}
                                                        {company.summary && (
                                                            <div className="flex gap-x-2 items-center justify-start">
                                                                <span>توضیحات: </span>
                                                                <p className="text-sm text-zinc-700 dark:text-zinc-300">{company.summary}</p>
                                                            </div>
                                                        )}
                                                        {company.address && (
                                                            <div>
                                                                <span >آدرس شرکت: </span>
                                                                <span>{company.address}</span>
                                                            </div>
                                                        )}
                                                        {company.phone && (
                                                            <div>
                                                                <span >تلفن تماس: </span>
                                                                <span>{company.phone}</span>
                                                            </div>
                                                        )}
                                                        {company.website_address && (
                                                            <div>
                                                                <span >وبسایت: </span>
                                                                <a
                                                                    className="text-blue-600 underline"
                                                                    href={(company.website_address || "").startsWith('http')
                                                                        ? company.website_address
                                                                        : `https://${company.website_address}`
                                                                    }
                                                                    target="_blank" rel="noopener noreferrer"
                                                                >
                                                                    {company.website_address}
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </SimpleAccordion>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            <Card className="border border-zinc-200/60 dark:border-white/10 shadow-sm">
                                <CardHeader>
                                    <CardTitle>
                                        <span className="flex items-center gap-2 text-lg font-medium moraba">
                                            <FiBriefcase className="text-xl" />
                                            آگهی‌های مشابه
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {relatedLoading ? (
                                        <div className="space-y-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Skeleton key={i} className="h-8 w-full" />
                                            ))}
                                        </div>
                                    ) : relatedJobs.length > 0 ? (
                                        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                            {relatedJobs.map(rjob => (
                                                <li
                                                    key={rjob.id}
                                                    className="py-3 flex items-center justify-between gap-1 bg-zinc-50 dark:bg-zinc-900/60 transition rounded-xl px-6 cursor-pointer"
                                                    onClick={() => navigate(`/job/${rjob.id}`)}
                                                    tabIndex={0}
                                                    role="button"
                                                >
                                                    <div className="flex flex-col gap-1">
                                                        <strong className="text-sm line-clamp-1">{rjob.title}</strong>
                                                        <span className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                                                            {rjob.company?.full_name || "-"}
                                                        </span>
                                                    </div>
                                                    <span className="flex items-center gap-2 mt-1 sm:mt-0">
                                                        {rjob.location && (
                                                            <span
                                                                className="inline text-xs text-zinc-500 dark:text-zinc-400"
                                                            >
                                                                <FiMapPin className="inline ml-1" />
                                                                {rjob.location}
                                                            </span>
                                                        )}
                                                        {rjob.employment_type && (
                                                            <Badge size="sm" className={cn("dark:bg-zinc-900 border-none py-1 font-medium", getJobTypeClasses(rjob.employment_type))}>
                                                                {rjob.employment_type}
                                                            </Badge>
                                                        )}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-xs text-zinc-500">آگهی مشابهی یافت نشد.</div>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="mt-4">
                                <Card className="border border-red-200 bg-red-50 dark:border-rose-800 dark:bg-rose-950/30">
                                    <CardContent
                                        className="py-3 px-4 flex items-center gap-3 cursor-pointer select-none"
                                        onClick={handleOpenReportModal}
                                        tabIndex={0}
                                        role="button"
                                    >
                                        <FiAlertTriangle className="text-rose-600 text-2xl" />
                                        <span className="text-sm text-rose-600">
                                            گزارش تخلف این آگهی
                                        </span>
                                    </CardContent>
                                </Card>
                            </div>


                        </div>

                        {/* Sidebar - Company Info & Actions */}
                        <div className="space-y-6 sticky top-28 left-1 max-h-min">
                            {/* Company Card */}
                            {company.id && (
                                <Card className="border border-zinc-200/60 dark:border-white/10 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="moraba">اطلاعات شرکت</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <hr />
                                        <div>
                                            <div className="text-xl mb-2">{company.full_name}</div>
                                            {company.industry && (
                                                <Badge className="text-xs py-1 px-2 text-zinc-500 dark:text-white bg-zinc-300 dark:bg-zinc-800 border font-medium">
                                                    {company.industry}
                                                </Badge>
                                            )}
                                        </div>
                                        {company.summary && (
                                            <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3">
                                                {company.summary}
                                            </p>
                                        )}
                                        <div className="space-y-2">
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
                                                    وب‌سایت شرکت
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start"
                                                onClick={() => navigate(`/company/${company.id}`)}
                                            >
                                                <MdOutlineMapsHomeWork />
                                                مشاهده پروفایل شرکت
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-2">
                                <Button
                                    className="w-full"
                                    onClick={openResumeModal}
                                    disabled={applicationSent}
                                >
                                    {applicationSent ? (
                                        <span className="flex items-center gap-2 text-green-600">
                                            <FiCheck />
                                            رزومه ارسال شد
                                        </span>
                                    ) : (
                                        "ارسال رزومه"
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate("/jobs/search")}
                                >
                                    <FiArrowRight className="mr-2" />
                                    لیست آگهی‌ها
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            <Dialog open={resumeModal} onOpenChange={setResumeModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>انتخاب رزومه جهت ارسال</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitResume}>
                        <div className="mb-4">
                            {resumeLoading ? (
                                <div className="text-center py-4">
                                    <Skeleton className="h-8 w-full mb-3" />
                                    <Skeleton className="h-14 w-full" />
                                </div>
                            ) : userResumes.length ? (
                                <div className="space-y-3 max-h-44 overflow-y-auto">
                                    {userResumes.map(resume => (
                                        <label
                                            key={resume.id}
                                            className={cn(
                                                "block cursor-pointer border rounded-md px-3 py-2 bg-zinc-50 dark:bg-zinc-800",
                                                selectedResume === resume.id ? "ring-2 ring-primary border-primary" : ""
                                            )}
                                        >
                                            <input
                                                className="mr-2"
                                                type="radio"
                                                name="resume"
                                                value={resume.id}
                                                checked={selectedResume === resume.id}
                                                onChange={() => setSelectedResume(resume.id)}
                                                required
                                                tabIndex={0}
                                            />
                                            <span >{resume.title || "رزومه بدون عنوان"}</span>
                                            {resume.summary && (
                                                <p className="text-xs text-zinc-500 mt-1">{resume.summary.slice(0, 40)}...</p>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-zinc-600 text-sm py-3">شما هیچ رزومه‌ای ثبت نکرده‌اید.</div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="cover-letter" className="block mb-1 font-medium text-sm">
                                توضیحات  (اختیاری)
                            </label>
                            <textarea
                                id="cover-letter"
                                name="cover-letter"
                                className="w-full border border-zinc-200/20 mt-4 rounded p-2 text-sm resize-y h-20 bg-transparent"
                                placeholder="اگر لازم است توضیحی اضافه بنویسید..."
                                value={coverLetter}
                                onChange={e => setCoverLetter(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => setResumeModal(false)}
                                disabled={resumeSubmitLoading}
                            >
                                انصراف
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    resumeLoading ||
                                    !selectedResume ||
                                    resumeSubmitLoading ||
                                    !userResumes.length
                                }
                                className="flex-1"
                            >
                                {resumeSubmitLoading ? "در حال ارسال..." : "ارسال رزومه"}
                            </Button>

                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal for violation report */}
            <Dialog open={reportModal} onOpenChange={setReportModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle >
                            گزارش تخلف
                        </DialogTitle>
                        <DialogDescription>
                            <p className="text-sm text-zinc-700 dark:text-zinc-200 mb-2 text-right mt-4">
                                چرا این آگهی مشکل دارد؟
                                <br />
                                یکی از گزینه‌های زیر را انتخاب کنید. توضیحات شما به ما کمک می‌کند بهتر مشکل گزارش شده را بررسی کنیم.
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleReportSubmit} className="space-y-4">
                        <div>
                            <div className="space-y-1">
                                {REPORT_OPTIONS.map(opt => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            className="accent-red-600"
                                            name="report-reason"
                                            value={opt}
                                            checked={reportOption === opt}
                                            onChange={() => setReportOption(opt)}
                                        />
                                        <span className="text-sm">{opt}</span>
                                    </label>
                                ))}
                            </div>
                            {reportTouched && !reportOption && (
                                <div className="text-xs text-rose-500 pt-1">لطفاً یک گزینه را انتخاب کنید</div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="report-desc" className="block mb-1 font-medium text-sm">
                                توضیحات بیشتر <span className="text-rose-600">(اجباری)</span>
                            </label>
                            <textarea
                                id="report-desc"
                                name="report-desc"
                                required
                                minLength={10}
                                className="w-full border border-zinc-200/20 mt-4 rounded p-2 text-sm resize-y h-20 bg-transparent"
                                placeholder="لطفاً بیشتر توضیح دهید..."
                                value={reportDesc}
                                onChange={e => setReportDesc(e.target.value)}
                            />
                            {reportTouched && !reportDesc.trim() && (
                                <div className="text-xs text-rose-500 pt-1">وارد کردن توضیحات الزامی است</div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => setReportModal(false)}
                                disabled={reportSubmit}
                            >
                                انصراف
                            </Button>
                            <Button
                                type="submit"
                                disabled={reportSubmit}
                                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                            >
                                {reportSubmit ? "در حال ارسال..." : "ارسال گزارش"}
                            </Button>

                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
