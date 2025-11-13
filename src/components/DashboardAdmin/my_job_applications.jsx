import React, { useEffect, useState, useContext } from "react";
import useAxios from '@/hooks/useAxios';
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { DataTable } from "@/components/data-table";
import { LuLoaderCircle } from "react-icons/lu";
import AuthContext from "@/context/authContext";

const jobAppSchema = z.object({
  job_posting: z.string().uuid(),
  cover_letter: z.string().optional(),
  status: z.enum(["در انتظار", "رد شده", "پذیرفته شده", "بازبینی"]),
});

export default function MyJobApplications() {
  const [applications, setApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const authContext = useContext(AuthContext);
  const { user } = authContext || {};
  const [formData, setFormData] = useState({
    job_posting: "",
    cover_letter: "",
    status: "در انتظار",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingGetData, setLoadingGetData] = useState(true);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const axiosInstance = useAxios();

  // Store job postings list for select
  const [jobPostings, setJobPostings] = useState([]);

  const fetchApplications = async () => {
    try {
      setLoadingGetData(true);
      const response = await axiosInstance.get(`/job_applications/?user_id=${user?.user_id}`);
      setApplications(response.data);
      setLoadingGetData(false);
    } catch (error) {
      toast.error("خطا در دریافت درخواست‌های شغلی");
      setLoadingGetData(false);
    }
  };

  const fetchJobPostings = async () => {
    // All jobs list for combobox
    try {
      const res = await axiosInstance.get(`/job_postings/?limit=100`);
      setJobPostings(res.data || []);
    } catch (e) {
      setJobPostings([]);
    }
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchApplications();
      fetchJobPostings();
    }
    // eslint-disable-next-line
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validatedData = jobAppSchema.parse({
        ...formData,
      });
      setErrors({});
      if (editingApp) {
        await axiosInstance.patch(`/job_applications/${editingApp.id}`, validatedData);
        toast.success("درخواست شغلی با موفقیت ویرایش شد");
      } else {
        await axiosInstance.post(`/job_applications`, {
          ...validatedData,
          user: user.user_id, // Backend might expect user id
        });
        toast.success("درخواست شغلی با موفقیت ارسال شد");
      }
      setFormData({
        job_posting: "",
        cover_letter: "",
        status: "در انتظار",
      });
      setEditingApp(null);
      setIsModalOpen(false);
      fetchApplications();
      setLoading(false);
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
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/job_applications/${deleteTargetId}`);
      toast.success("درخواست شغلی حذف شد");
      fetchApplications();
    } catch (error) {
      toast.error("خطا در حذف درخواست");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
    }
  };

  const handleEdit = (app) => {
    setEditingApp(app);
    setFormData({
      job_posting: app.job_posting?.id || "",
      cover_letter: app.cover_letter || "",
      status: app.status,
    });
    setIsModalOpen(true);
  };

  const headers = [
    { key: "job_posting", label: "شغل" },
    { key: "cover_letter", label: "متن پوششی" },
    { key: "status", label: "وضعیت" },
    { key: "created_at", label: "تاریخ ارسال" },
  ];

  const mappings = {
    status: {
      "در انتظار": "در انتظار",
      "رد شده": "رد شده",
      "پذیرفته شده": "پذیرفته شده",
      "بازبینی": "بازبینی",
    },
    job_posting: (job_posting) =>
      job_posting?.job_title || "بدون عنوان",
    created_at: (created_at) =>
      created_at ? new Date(created_at).toLocaleDateString('fa-IR') : "",
  };

  return (
    <div className="p-4 lg:p-6" dir="rtl">
      <Toaster className="dana" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold moraba">درخواست‌های شغلی من</h1>
        <Button onClick={() => { setIsModalOpen(true); setEditingApp(null); }}>
          ارسال درخواست جدید
        </Button>
      </div>
      {loadingGetData ? (
        <LuLoaderCircle className="animate-spin h-8 w-8 mx-auto mt-10  text-black dark:text-white" />
      ) : (
        <DataTable
          headers={headers}
          data={applications}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          valueMappings={mappings}
        />
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingApp ? "ویرایش درخواست شغلی" : "ارسال درخواست جدید"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="job_posting">شغل</Label>
              <Select
                value={formData.job_posting}
                onValueChange={value => handleSelectChange("job_posting", value)}
                disabled={!!editingApp}
              >
                <SelectTrigger id="job_posting">
                  <SelectValue placeholder="انتخاب شغل" />
                </SelectTrigger>
                <SelectContent>
                  {jobPostings.map(j => (
                    <SelectItem key={j.id} value={j.id}>
                      {j.job_title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.job_posting && <p className="text-red-500 text-sm">{errors.job_posting}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cover_letter">متن پوششی</Label>
              <Input
                id="cover_letter"
                name="cover_letter"
                value={formData.cover_letter}
                onChange={handleInputChange}
              />
              {errors.cover_letter && <p className="text-red-500 text-sm">{errors.cover_letter}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">وضعیت</Label>
              <Select
                value={formData.status}
                onValueChange={value => handleSelectChange("status", value)}
                disabled
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="وضعیت درخواست" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="در انتظار">در انتظار</SelectItem>
                  <SelectItem value="رد شده">رد شده</SelectItem>
                  <SelectItem value="پذیرفته شده">پذیرفته شده</SelectItem>
                  <SelectItem value="بازبینی">بازبینی</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="ml-2"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingApp(null);
                }}
                type="button"
              >
                لغو
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && (
                  <LuLoaderCircle className="animate-spin h-4 w-4  text-white dark:text-black" />
                )}
                {editingApp ? "ویرایش" : "ارسال"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>حذف درخواست شغلی</DialogTitle>
          </DialogHeader>
          <p className="my-5">آیا مطمئن هستید که می‌خواهید این درخواست را حذف کنید؟</p>
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
    </div>
  );
}
