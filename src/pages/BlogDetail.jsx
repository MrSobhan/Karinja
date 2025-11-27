import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
    FiEye,
    FiHeart,
    FiMessageCircle,
    FiCalendar,
    FiUser,
    FiArrowRight,
    FiSend,
} from "react-icons/fi";
import useAxios from "@/hooks/useAxios";
import AuthContext from "@/context/authContext";
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

export default function BlogDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosInstance = useAxios();
    const { user, isLogin } = useContext(AuthContext);

    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [commentContent, setCommentContent] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);

    useEffect(() => {
        document.title = `جزئیات مقاله | کاراینجا`;
    }, []);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError("");
        setBlog(null);
        setLoadingComments(true);

        if (!id) return;
        (async () => {
            try {
                const response = await axiosInstance.get(`/blogs/${id}`);
                if (!cancelled) {
                    setBlog(response.data);
                    // Extract comments from blog response
                    const blogComments = response.data?.comments || [];
                    setComments(Array.isArray(blogComments) ? blogComments : []);
                }
            } catch (err) {
                if (!cancelled) {
                    if (err.response?.status === 404) {
                        setError("مقاله مورد نظر یافت نشد.");
                    } else {
                        setError("خطا در دریافت اطلاعات مقاله. لطفاً دوباره تلاش کنید.");
                    }
                    console.error("Blog fetch error:", err);
                    setComments([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                    setLoadingComments(false);
                }
            }
        })();
        return () => { cancelled = true; };
    }, [id]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        
        if (!isLogin()) {
            toast.info("لطفاً جهت ثبت کامنت وارد شوید.");
            navigate("/login", { replace: true });
            return;
        }

        if (!commentContent.trim()) {
            toast.error("لطفاً متن کامنت را وارد کنید.");
            return;
        }

        if (!user?.user_id) {
            toast.error("خطا در دریافت اطلاعات کاربر.");
            return;
        }

        setSubmittingComment(true);
        try {
            const commentData = {
                content: commentContent.trim(),
                is_approved: false,
                is_spam: false,
                blog_id: id,
                user_id: user.user_id,
            };

            await axiosInstance.post("/comments/", commentData);
            toast.success("کامنت شما با موفقیت ثبت شد و در انتظار تایید است.");
            setCommentContent("");
            
            // Refresh comments
            const response = await axiosInstance.get(`/blogs/${id}`);
            if (response.data) {
                const blogComments = response.data.comments || [];
                setComments(Array.isArray(blogComments) ? blogComments : []);
            }
        } catch (err) {
            console.error("Comment submit error:", err);
            if (err.response?.status === 401) {
                toast.error("لطفاً جهت ثبت کامنت وارد شوید.");
                navigate("/login", { replace: true });
            } else {
                toast.error("خطا در ثبت کامنت. لطفاً دوباره تلاش کنید.");
            }
        } finally {
            setSubmittingComment(false);
        }
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
                            </CardContent>
                        </Card>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (error || !blog) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-[#f7f7f7] dark:bg-background pt-28 pb-16" dir="rtl">
                    <div className="container px-4 mx-auto max-w-5xl">
                        <Card className="border border-dashed">
                            <CardContent className="py-12 text-center space-y-4">
                                <FiMessageCircle className="w-12 h-12 mx-auto text-zinc-400" />
                                <p className="text-lg font-semibold">{error || "مقاله یافت نشد"}</p>
                                <Button onClick={() => navigate("/blogs")}>
                                    بازگشت به لیست مقالات
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const publishedDate = formatPersianDate(blog.published_at || blog.created_at);
    const authorName = blog.user?.full_name || blog.user?.username || "ناشناس";
    const approvedComments = comments.filter(comment => comment.is_approved && !comment.is_spam);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#f7f7f7] dark:bg-background pt-12 lg:pt-28 pb-16" dir="rtl">
                <div className="container px-4 mx-auto max-w-5xl space-y-6">
                    {/* Header Section */}
                    <Card className="border border-zinc-200/60 dark:border-white/10 shadow-sm">
                        <CardHeader className="space-y-4">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <CardTitle className="text-2xl md:text-3xl font-bold mb-2">
                                            {blog.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-3 text-muted-foreground mt-2">
                                            <div className="flex items-center gap-2">
                                                <FiUser className="text-lg" />
                                                <span className="text-sm">{authorName}</span>
                                            </div>
                                            {publishedDate && (
                                                <div className="flex items-center gap-2">
                                                    <FiCalendar className="text-lg" />
                                                    <span className="text-sm">{publishedDate}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-end items-center">
                                        {blog.status && (
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    blog.status === "منتشر شده"
                                                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                                        : "bg-gray-100 text-gray-700 border-gray-200",
                                                    "border"
                                                )}
                                            >
                                                {blog.status}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm pt-2 border-t">
                                    <div className="flex items-center justify-between gap-2 text-blue-500">
                                        <FiEye className="text-base" />
                                        <span className="mt-1">{blog.views_count || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 text-rose-500">
                                        <FiHeart className="text-base" />
                                        <span className="mt-1">{blog.likes_count || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 text-emerald-600">
                                        <FiMessageCircle className="text-base" />
                                        <span className="mt-1">{blog.comments_count || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Blog Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Blog Body */}
                            <Card className="border border-zinc-200/60 dark:border-white/10 shadow-sm">
                                <CardContent className="pt-6">
                                    <div className="prose prose-sm max-w-none text-zinc-700 dark:text-zinc-300 leading-7 whitespace-pre-wrap">
                                        {blog.content || "بدون محتوا"}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Comments Section */}
                            <Card className="border border-zinc-200/60 dark:border-white/10 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FiMessageCircle className="text-xl" />
                                        کامنت‌ها ({approvedComments.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Comment Form */}
                                    <form onSubmit={handleSubmitComment} className="space-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="comment" className="text-sm font-medium">
                                                ثبت کامنت
                                            </label>
                                            <Textarea
                                                id="comment"
                                                value={commentContent}
                                                onChange={(e) => setCommentContent(e.target.value)}
                                                placeholder="نظر خود را بنویسید..."
                                                rows={4}
                                                className="resize-none"
                                                disabled={submittingComment}
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={submittingComment || !commentContent.trim()}
                                            className="w-full sm:w-auto"
                                        >
                                            {submittingComment ? (
                                                "در حال ارسال..."
                                            ) : (
                                                <>
                                                    <FiSend className="ml-2" />
                                                    ارسال کامنت
                                                </>
                                            )}
                                        </Button>
                                    </form>

                                    <div className="border-t pt-6 space-y-4">
                                        {loadingComments ? (
                                            <div className="space-y-4">
                                                <Skeleton className="h-20 w-full" />
                                                <Skeleton className="h-20 w-full" />
                                            </div>
                                        ) : approvedComments.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <FiMessageCircle className="w-12 h-12 mx-auto mb-3 text-zinc-400" />
                                                <p>هنوز کامنتی ثبت نشده است.</p>
                                            </div>
                                        ) : (
                                            approvedComments.map(comment => {
                                                const commentDate = formatPersianDate(comment.created_at);
                                                const commentAuthor = comment.user?.full_name || comment.user?.username || "ناشناس";
                                                return (
                                                    <div
                                                        key={comment.id}
                                                        className="border-b border-zinc-200 dark:border-zinc-700 pb-4 last:border-0 last:pb-0"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                                                                <FiUser className="text-zinc-600 dark:text-zinc-300" />
                                                            </div>
                                                            <div className="flex-1 space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-semibold text-sm">{commentAuthor}</span>
                                                                    {commentDate && (
                                                                        <span className="text-xs text-muted-foreground">
                                                                            {commentDate}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-6">
                                                                    {comment.content}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6 !max-h-min sticky top-28 left-0">
                            {/* Author Info */}
                            <Card className="border border-zinc-200/60 dark:border-white/10 shadow-sm">
                                <CardHeader>
                                    <CardTitle>نویسنده</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                                            <FiUser className="text-xl text-zinc-600 dark:text-zinc-300" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">{authorName}</div>
                                            {blog.user?.email && (
                                                <div className="text-xs text-muted-foreground">
                                                    {blog.user.email}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate("/blogs")}
                                >
                                    <FiArrowRight className="mr-2" />
                                    لیست مقالات
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

