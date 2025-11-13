import React, { useEffect, useState, useContext } from "react";
import useAxios from "@/hooks/useAxios";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DataTable } from "@/components/data-table";
import { LuLoaderCircle } from "react-icons/lu";

import AuthContext from "@/context/authContext";

const applicationSchema = z.object({
    application_date: z.string().min(1, "تاریخ اپلای الزامی است"),
    status: z.string().min(1, "وضعیت الزامی است"),
    job_posting_id: z.string().uuid("آگهی شغلی نامعتبر است"),
    job_seeker_resume_id: z.string().uuid("رزومه کارجو نامعتبر است"),
});

const statusOptions = [
    { value: "ارسال شده", label: "ارسال شده" },
    { value: "در حال بررسی", label: "در حال بررسی" },
    { value: "رد شده", label: "رد شده" },
    { value: "پذیرفته شده", label: "پذیرفته شده" }
];

export default function JobApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingJobPostings, setLoadingJobPostings] = useState(true);
    const [loadingResumes, setLoadingResumes] = useState(true);

    const [jobPostings, setJobPostings] = useState([]);
    const [resumes, setResumes] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingApplication, setEditingApplication] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [formData, setFormData] = useState({
        application_date: new Date().toISOString().split("T")[0],
        status: "ارسال شده",
        job_posting_id: "",
        job_seeker_resume_id: "",
    });
    const [errors, setErrors] = useState({});
    const { user } = useContext(AuthContext);

    const axiosInstance = useAxios();

    const [userRole, setUserRole] = useState(() => user.user_role == "admin" || user.user_role == "full_admin");

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/job_applications/?offset=0&limit=100`);
            setApplications(res.data);
        } catch (err) {
            toast.error("خطا در دریافت درخواست‌های شغلی");
        }
        setLoading(false);
    };

    const fetchJobPostings = async () => {
        setLoadingJobPostings(true);
        try {
            const res = await axiosInstance.get(`/job_postings/?offset=0&limit=100`);
            setJobPostings(res.data);
        } catch (err) {
            toast.error("خطا در دریافت فرصت های شغلی");
        }
        setLoadingJobPostings(false);
    };

    const fetchResumes = async () => {
        setLoadingResumes(true);
        try {
            const res = await axiosInstance.get(`/job_seeker_resumes`);
            setResumes(res.data);
        } catch (err) {
            toast.error("خطا در دریافت  رزومه ها");
        }
        setLoadingResumes(false);
    };

    useEffect(() => {
        fetchApplications();
        fetchJobPostings();
        fetchResumes();
    }, []);

    // ----- HANDLERS -----
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ----- ADMIN FULL ACCESS -----
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);
        try {
            const validatedData = applicationSchema.parse(formData);
            setErrors({});
            if (editingApplication) {
                await axiosInstance.patch(`/job_applications/${editingApplication.id}`, validatedData);
                toast.success("درخواست شغلی با موفقیت ویرایش شد");
            } else {
                await axiosInstance.post(`/job_applications`, validatedData);
                toast.success("درخواست شغلی با موفقیت اضافه شد");
            }
            setFormData({
                application_date: new Date().toISOString().split("T")[0],
                status: "ارسال شده",
                job_posting_id: "",
                job_seeker_resume_id: "",
            });
            setEditingApplication(null);
            setIsModalOpen(false);
            fetchApplications();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = {};
                error.errors.forEach((err) => {
                    fieldErrors[err.path[0]] = err.message;
                });
                setErrors(fieldErrors);
            } else {
                toast.error("خطا در ذخیره درخواست شغلی");
            }
        }
        setLoadingSubmit(false);
    };

    const handleDeleteClick = (id) => {
        setDeleteTargetId(id);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axiosInstance.delete(`/job_applications/${deleteTargetId}`);
            toast.success("درخواست شغلی با موفقیت حذف شد");
            fetchApplications();
        } catch (error) {
            toast.error("خطا در حذف درخواست شغلی");
        } finally {
            setDeleteDialogOpen(false);
            setDeleteTargetId(null);
        }
    };

    const handleEdit = (application) => {
        setEditingApplication(application);
        setFormData({
            application_date: application.application_date || "",
            status: application.status || "ارسال شده",
            cover_letter: application.cover_letter || "",
            job_posting_id: application.job_posting?.id || "",
            job_seeker_resume_id: application.resume?.id || "",
        });
        setIsModalOpen(true);
    };
    // ----- END ADMIN FULL ACCESS -----

    // ----- USERS (not admin) CAN ONLY UPDATE STATUS -----
    const [editingStatusApp, setEditingStatusApp] = useState(null);

    const handleStatusEditClick = (application) => {
        setEditingStatusApp(application);
        setFormData({
            status: application.status || "ارسال شده"
        });
        setIsModalOpen(true);
    };

    const handleStatusUpdateSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);
        try {
            // Only submit updated status!
            await axiosInstance.patch(`/job_applications/${editingStatusApp.id}`, { status: formData.status });
            toast.success("وضعیت درخواست با موفقیت بروزرسانی شد");
            setIsModalOpen(false);
            fetchApplications();
        } catch (error) {
            toast.error("خطا در بروزرسانی وضعیت درخواست");
        }
        setLoadingSubmit(false);
        setEditingStatusApp(null);
        setFormData({
            application_date: new Date().toISOString().split("T")[0],
            status: "ارسال شده",
            job_posting_id: "",
            job_seeker_resume_id: "",
        });
    };
    // ----- END USERS (not admin) -----

    const headers = [
        { key: "application_date", label: "تاریخ درخواست" },
        { key: "status", label: "وضعیت" },
        { key: "job_posting", label: "آگهی شغلی" },
        { key: "resume", label: "رزومه ارسال‌شده" },
        { key: "cover_letter", label: "متن کاورلتر" },
    ];

    const mappings = {
        job_posting: (v, row) => row.job_posting ? row.job_posting.title : "",
        resume: (v, row) => row.resume ? row.resume.job_title : "",
    };

    return (
        <div className="p-4 lg:p-6" dir="rtl">
            <Toaster className="dana" />
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold moraba">مدیریت درخواست‌های شغلی</h1>
                {userRole && (
                    <Button onClick={() => {
                        setEditingApplication(null);
                        setIsModalOpen(true);
                    }}>
                        افزودن درخواست شغلی
                    </Button>
                )}
            </div>
            {
                loading ? (
                    <LuLoaderCircle className="animate-spin h-8 w-8 mx-auto mt-10 text-black dark:text-white" />
                ) : (
                    <DataTable
                        headers={headers}
                        data={applications}
                        // ADMIN: Edit/Delete;  USER: No
                        onEdit={userRole ? handleEdit : undefined}
                        onDelete={userRole ? handleDeleteClick : undefined}
                        valueMappings={mappings}
                        renderRowActions={(rowData) =>
                            !userRole  ? (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleStatusEditClick(rowData)}
                                >
                                    تغییر وضعیت
                                </Button>
                            ) : null
                        }
                    />
                )
            }

            {/* ADMIN FULL FORM */}
            {userRole && (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[425px]" dir="rtl">
                        <DialogHeader>
                            <DialogTitle>{editingApplication ? "ویرایش درخواست شغلی" : "افزودن درخواست شغلی"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="grid gap-4 py-4">

                            <div className="grid gap-2">
                                <Label htmlFor="job_posting_id">آگهی شغلی</Label>
                                <Select
                                    value={formData.job_posting_id}
                                    onValueChange={val => handleSelectChange("job_posting_id", val)}
                                    disabled={loadingJobPostings}
                                >
                                    <SelectTrigger id="job_posting_id">
                                        <SelectValue placeholder={loadingJobPostings ? "در حال دریافت..." : "انتخاب آگهی"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {jobPostings.map((jp) =>
                                            <SelectItem value={jp.id} key={jp.id}>{jp.title}</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.job_posting_id && (
                                    <p className="text-red-500 text-sm">{errors.job_posting_id}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="job_seeker_resume_id">رزومه ارسال‌شده</Label>
                                <Select
                                    value={formData.job_seeker_resume_id}
                                    onValueChange={val => handleSelectChange("job_seeker_resume_id", val)}
                                    disabled={loadingResumes}
                                >
                                    <SelectTrigger id="job_seeker_resume_id">
                                        <SelectValue placeholder={loadingResumes ? "در حال دریافت..." : "انتخاب رزومه"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {resumes.map((r) =>
                                            <SelectItem value={r.id} key={r.id}>{r.job_title}</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.job_seeker_resume_id && (
                                    <p className="text-red-500 text-sm">{errors.job_seeker_resume_id}</p>
                                )}
                            </div>
                           
                            <div className="grid gap-2">
                                <Label htmlFor="status">وضعیت</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={val => handleSelectChange("status", val)}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="انتخاب وضعیت" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map(opt =>
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-red-500 text-sm">{errors.status}</p>
                                )}
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    className="ml-2"
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingApplication(null);
                                    }}
                                >
                                    لغو
                                </Button>
                                <Button type="submit" disabled={loadingSubmit}>
                                    {loadingSubmit && (
                                        <LuLoaderCircle className="animate-spin h-4 w-4 text-white dark:text-black" />
                                    )}
                                    {editingApplication ? "ویرایش" : "افزودن"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}

            {/* USER (not admin) STATUS ONLY DIALOG */}
            {!userRole && (
                <Dialog open={Boolean(isModalOpen)} onOpenChange={(open) => {
                    setIsModalOpen(open);
                    if (!open) setEditingStatusApp(null);
                }}>
                    <DialogContent className="sm:max-w-[375px]" dir="rtl">
                        <DialogHeader>
                            <DialogTitle>تغییر وضعیت درخواست شغلی</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleStatusUpdateSubmit} className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="status">وضعیت</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={val => setFormData((f) => ({ ...f, status: val }))}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="انتخاب وضعیت" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map(opt =>
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    className="ml-2"
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingStatusApp(null);
                                    }}>
                                    لغو
                                </Button>
                                <Button type="submit" disabled={loadingSubmit}>
                                    {loadingSubmit && (
                                        <LuLoaderCircle className="animate-spin h-4 w-4 text-white dark:text-black" />
                                    )}
                                    بروزرسانی
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}

            {/* ADMIN DELETE DIALOG */}
            {userRole && (
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>حذف درخواست شغلی</DialogTitle>
                        </DialogHeader>
                        <p className="my-5">آیا مطمئن هستید که می‌خواهید این درخواست شغلی را حذف کنید؟</p>
                        <DialogFooter>
                            <Button variant="outline" className="ml-2" onClick={() => setDeleteDialogOpen(false)}>
                                انصراف
                            </Button>
                            <Button variant="destructive" onClick={handleConfirmDelete}>
                                حذف
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}