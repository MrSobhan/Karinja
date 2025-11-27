import React, { useEffect, useState, useContext } from "react";
import useAxios from "@/hooks/useAxios";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/data-table";
import { LuLoaderCircle } from "react-icons/lu";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import AuthContext from "@/context/authContext";

const statusOptions = [
    { value: "پیش نویس", label: "پیش نویس" },
    { value: "منتشر شده", label: "منتشر شده" },
    { value: "آرشیو", label: "آرشیو" },
];

const blogSchema = z.object({
    title: z.string().min(1, "عنوان الزامی است"),
    content: z.string().min(1, "متن الزامی است"),
    status: z.enum(statusOptions.map((opt) => opt.value)),
});

const Blogs = () => {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        status: "پیش نویس",
        views_count: 0,
        likes_count: 0,
        comments_count: 0,
        published_at: new Intl.DateTimeFormat("fa-IR").format(new Date()),
        user_id: user.user_id,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingGetData, setLoadingGetData] = useState(true);

    // Delete Dialog State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    // View Content Dialog
    const [viewContentDialogOpen, setViewContentDialogOpen] = useState(false);
    const [viewContentBlog, setViewContentBlog] = useState(null);

    const axiosInstance = useAxios();

    const fetchBlogs = async () => {
        try {
            const res = await axiosInstance.get(`/blogs/?offset=0&limit=100`);
            setData(res.data);
        } catch (e) {
            toast.error("خطا در دریافت لیست وبلاگ‌ها");
        }
        setLoadingGetData(false);
    };

    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get(`/users/?offset=0&limit=100`);
            setUsers(res.data);
        } catch (e) {
            toast.error("خطا در دریافت لیست کاربران");
        }
    };

    useEffect(() => {
        fetchBlogs();
        fetchUsers();
    }, []);

    // Form input handlers
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "number" ||
                name === "views_count" ||
                name === "likes_count" ||
                name === "comments_count"
                    ? Number(value)
                    : value,
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            blogSchema.parse(formData);
            let res;
            if (editingBlog) {
                res = await axiosInstance.patch(
                    `/blogs/${editingBlog.id}`,
                    formData
                );
                toast.success("وبلاگ با موفقیت ویرایش شد");
            } else {
                res = await axiosInstance.post(`/blogs`, formData);
                toast.success("وبلاگ با موفقیت اضافه شد");
            }

            setFormData({
                title: "",
                content: "",
                status: "پیش نویس",
                views_count: 0,
                likes_count: 0,
                comments_count: 0,
                published_at: "",
                user_id: "",
            });
            setEditingBlog(null);
            setIsModalOpen(false);
            fetchBlogs();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errs = {};
                error.errors.forEach((err) => {
                    errs[err.path[0]] = err.message;
                });
                setErrors(errs);
            } else {
                toast.error("خطا در ذخیره وبلاگ");
            }

            console.log(error);
        }
        setLoading(false);
    };

    const handleEdit = (blog) => {
        setEditingBlog(blog);
        setFormData({
            title: blog.title,
            content: blog.content,
            status: blog.status,
            views_count: blog.views_count,
            likes_count: blog.likes_count,
            comments_count: blog.comments_count,
            published_at: new Intl.DateTimeFormat("fa-IR").format(new Date()),
            user_id: user.user_id || "",
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        setDeleteTargetId(id);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axiosInstance.delete(`/blogs/${deleteTargetId}`);
            toast.success("وبلاگ با موفقیت حذف شد");
            fetchBlogs();
        } catch (error) {
            toast.error("خطا در حذف وبلاگ");
        } finally {
            setDeleteDialogOpen(false);
            setDeleteTargetId(null);
        }
    };

    const headers = [
        { key: "title", label: "عنوان" },
        { key: "status", label: "وضعیت" },
        { key: "views_count", label: "تعداد بازدید" },
        { key: "likes_count", label: "تعداد لایک" },
        { key: "comments_count", label: "کامنت‌ها" },
        { key: "published_at", label: "تاریخ انتشار" },
        { key: "user.full_name", label: "کاربر" },
        {
            key: "actions",
            label: "محتوا",
            render: (cellValue, row) => (
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                        
                        setViewContentBlog(row);
                        setViewContentDialogOpen(true);
                    }}
                >
                    مشاهده محتوا
                </Button>
            ),
        },
    ];

    return (
        <div className="p-4 lg:p-6" dir="rtl">
            <Toaster className="dana" />
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold moraba">
                    مدیریت وبلاگ‌ها
                </h1>
                <Button onClick={() => setIsModalOpen(true)}>افزودن وبلاگ</Button>
            </div>
            {loadingGetData ? (
                <LuLoaderCircle className="animate-spin h-8 w-8 mx-auto mt-10 text-black dark:text-white" />
            ) : (
                <DataTable
                    headers={headers}
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]" dir="rtl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingBlog
                                ? "ویرایش وبلاگ"
                                : "افزودن وبلاگ"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">عنوان</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={errors.title ? "border-red-500" : ""}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm">
                                    {errors.title}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="content">متن</Label>
                            <Textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                className={errors.content ? "border-red-500" : ""}
                                rows={4}
                            />
                            {errors.content && (
                                <p className="text-red-500 text-sm">
                                    {errors.content}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">وضعیت</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val) =>
                                    handleSelectChange("status", val)
                                }
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="انتخاب وضعیت" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((opt) => (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-red-500 text-sm">
                                    {errors.status}
                                </p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                className="ml-2"
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingBlog(null);
                                }}
                            >
                                لغو
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && (
                                    <LuLoaderCircle className="animate-spin h-4 w-4 text-white dark:text-black" />
                                )}
                                {editingBlog ? "ویرایش" : "افزودن"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={viewContentDialogOpen}
                onOpenChange={setViewContentDialogOpen}
            >
                <DialogContent className="sm:max-w-[600px]" dir="rtl">
                    <DialogHeader>
                        <DialogTitle>
                            {viewContentBlog
                                ? `محتوای «${viewContentBlog.title}»`
                                : ""}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-5 whitespace-pre-line break-words overflow-x-auto max-h-[400px]">
                        {viewContentBlog?.content}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setViewContentDialogOpen(false)}
                        >
                            بستن
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>حذف وبلاگ</DialogTitle>
                    </DialogHeader>
                    <p className="my-5">
                        آیا مطمئن هستید که می‌خواهید این وبلاگ را حذف کنید؟
                    </p>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="ml-2"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            انصراف
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                        >
                            حذف
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Blogs;