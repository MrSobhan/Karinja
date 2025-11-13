import React, { useEffect, useState } from "react"
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

const jobPostingSchema = z.object({
  title: z.string().min(1, "عنوان الزامی است"),
  location: z.string().min(1, "محل کار الزامی است"),
  job_description: z.string().min(1, "توضیحات الزامی است"),
  employment_type: z.enum(["تمام‌وقت", "پاره‌وقت", "دورکاری", "پروژه‌ای"]),
  posted_date: z.string().min(1, "تاریخ انتشار الزامی است"),
  expiry_date: z.string().min(1, "تاریخ پایان الزامی است"),
  salary_unit: z.enum(["ساعتی", "ماهیانه", "سالانه"]),
  salary_range: z.number(),
  job_categoriy: z.string().min(1, "دسته بندی شغلی الزامی است"),
  vacancy_count: z.number(),
  status: z.enum(["در انتظار تایید", "منتشر شده", "رد شده"]),
  company_id: z.string().min(1, "شرکت الزامی است"),
});

const employmentTypeOpts = [
  { value: "تمام‌وقت", label: "تمام‌وقت" },
  { value: "پاره‌وقت", label: "پاره‌وقت" },
  { value: "دورکاری", label: "دورکاری" },
  { value: "پروژه‌ای", label: "پروژه‌ای" },
];

const salaryUnitOpts = [
  { value: "ساعتی", label: "ساعتی" },
  { value: "ماهیانه", label: "ماهیانه" },
  { value: "سالانه", label: "سالانه" },
];

const jobStatusOpts = [
  { value: "در انتظار تایید", label: "در انتظار تایید" },
  { value: "منتشر شده", label: "منتشر شده" },
  { value: "رد شده", label: "رد شده" },
];

export default function JobPostings() {
  const [jobPostings, setJobPostings] = useState([])
  const [companies, setCompanies] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    location: "آذربایجان شرقی",
    job_description: "",
    employment_type: "تمام‌وقت",
    posted_date: "",
    expiry_date: "",
    salary_unit: "ساعتی",
    salary_range: 0,
    job_categoriy: "",
    vacancy_count: 0,
    status: "در انتظار تایید",
    company_id: "",
  });
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false);
  const [loadingGetData, setLoadingGetData] = useState(true);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const axiosInstance = useAxios();

  // Fetch job postings
  const fetchJobPostings = async () => {
    try {
      const res = await axiosInstance.get(`/job_postings/?offset=0&limit=100`);
      setJobPostings(res.data);
    } catch (e) {
      toast.error("خطا در دریافت آگهی‌ها");
    }
    setLoadingGetData(false);
  };

  // Fetch companies for the select field
  const fetchCompanies = async () => {
    try {
      const res = await axiosInstance.get(`/employer_companies/?offset=0&limit=100`);
      setCompanies(res.data);
    } catch (e) {
      toast.error("خطا در دریافت شرکت‌ها");
    }
  };

  useEffect(() => {
    fetchJobPostings();
    fetchCompanies();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validatedData = jobPostingSchema.parse(formData);
      setErrors({});
      if (editingJob) {
        await axiosInstance.patch(`/job_postings/${editingJob.id}`, validatedData);
        toast.success("آگهی با موفقیت ویرایش شد");
      } else {
        await axiosInstance.post(`/job_postings`, validatedData);
        toast.success("آگهی با موفقیت اضافه شد");
      }
      setFormData({
        title: "",
        location: "آذربایجان شرقی",
        job_description: "",
        employment_type: "تمام‌وقت",
        posted_date: "",
        expiry_date: "",
        salary_unit: "ساعتی",
        salary_range: 0,
        job_categoriy: "",
        vacancy_count: 0,
        status: "در انتظار تایید",
        company_id: "",
      });
      setEditingJob(null);
      setIsModalOpen(false);
      fetchJobPostings();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errs = {};
        error.errors.forEach((err) => {
          errs[err.path[0]] = err.message;
        });
        setErrors(errs);
      } else {
        toast.error("خطا در ذخیره آگهی");
      }
    }
    setLoading(false);
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      location: job.location,
      job_description: job.job_description,
      employment_type: job.employment_type,
      posted_date: job.posted_date,
      expiry_date: job.expiry_date,
      salary_unit: job.salary_unit,
      salary_range: job.salary_range,
      job_categoriy: job.job_categoriy,
      vacancy_count: job.vacancy_count,
      status: job.status,
      company_id: job.company?.id || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/job_postings/${deleteTargetId}`);
      toast.success("آگهی با موفقیت حذف شد");
      fetchJobPostings();
    } catch (error) {
      toast.error("خطا در حذف آگهی");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
    }
  };

  const headers = [
    { key: "title", label: "عنوان" },
    { key: "location", label: "محل کار" },
    { key: "employment_type", label: "نوع استخدام" },
    { key: "job_categoriy", label: "دسته بندی" },
    { key: "vacancy_count", label: "تعداد جایگاه" },
    { key: "salary_unit", label: "نوع حقوق" },
    { key: "salary_range", label: "حقوق" },
    { key: "status", label: "وضعیت" },
    { key: "company", label: "شرکت" },
    { key: "posted_date", label: "تاریخ انتشار" },
    { key: "expiry_date", label: "تاریخ پایان" },
  ];

  const mappings = {
    company: (v, row) => row.company ? row.company.full_name : "",
  };

  return (
    <div className="p-4 lg:p-6" dir="rtl">
      <Toaster className="dana" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold moraba">مدیریت آگهی‌ها</h1>
        <Button onClick={() => setIsModalOpen(true)}>افزودن آگهی</Button>
      </div>
      {loadingGetData ? (
        <LuLoaderCircle className="animate-spin h-8 w-8 mx-auto mt-10  text-black dark:text-white" />
      ) : (
        <DataTable
          headers={headers}
          data={jobPostings}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          valueMappings={mappings}
        />
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingJob ? "ویرایش آگهی" : "افزودن آگهی"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">

            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">عنوان شغل</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="job_categoriy">دسته بندی شغلی</Label>
                <Input
                  id="job_categoriy"
                  name="job_categoriy"
                  value={formData.job_categoriy}
                  onChange={handleInputChange}
                  className={errors.job_categoriy ? "border-red-500" : ""}
                />
                {errors.job_categoriy && <p className="text-red-500 text-sm">{errors.job_categoriy}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="job_description">توضیحات شغل</Label>
                <Input
                  id="job_description"
                  name="job_description"
                  value={formData.job_description}
                  onChange={handleInputChange}
                  className={errors.job_description ? "border-red-500" : ""}
                />
                {errors.job_description && <p className="text-red-500 text-sm">{errors.job_description}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="company_id">شرکت</Label>
                <Select
                  value={formData.company_id}
                  onValueChange={(value) => handleSelectChange("company_id", value)}
                >
                  <SelectTrigger id="company_id">
                    <SelectValue placeholder="انتخاب شرکت" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(company => (
                      <SelectItem key={company.id} value={company.id}>{company.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.company_id && <p className="text-red-500 text-sm">{errors.company_id}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">محل کار</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={errors.location ? "border-red-500" : ""}
                />
                {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="employment_type">نوع استخدام</Label>
                <Select
                  value={formData.employment_type}
                  onValueChange={(value) => handleSelectChange("employment_type", value)}
                >
                  <SelectTrigger id="employment_type">
                    <SelectValue placeholder="انتخاب نوع استخدام" />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentTypeOpts.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.employment_type && <p className="text-red-500 text-sm">{errors.employment_type}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">وضعیت</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="انتخاب وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobStatusOpts.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1  gap-4">
              
              <div className="grid gap-2">
                <Label htmlFor="expiry_date">تاریخ پایان</Label>
                <Input
                  id="expiry_date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleInputChange}
                  className={errors.expiry_date ? "border-red-500" : ""}
                />
                {errors.expiry_date && <p className="text-red-500 text-sm">{errors.expiry_date}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="salary_unit">نوع حقوق</Label>
                <Select
                  value={formData.salary_unit}
                  onValueChange={(value) => handleSelectChange("salary_unit", value)}
                >
                  <SelectTrigger id="salary_unit">
                    <SelectValue placeholder="انتخاب نوع حقوق" />
                  </SelectTrigger>
                  <SelectContent>
                    {salaryUnitOpts.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.salary_unit && <p className="text-red-500 text-sm">{errors.salary_unit}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="salary_range">حقوق</Label>
                <Input
                  id="salary_range"
                  name="salary_range"
                  type="number"
                  value={formData.salary_range}
                  onChange={handleInputChange}
                  className={errors.salary_range ? "border-red-500" : ""}
                />
                {errors.salary_range && <p className="text-red-500 text-sm">{errors.salary_range}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vacancy_count">تعداد جایگاه</Label>
                <Input
                  id="vacancy_count"
                  name="vacancy_count"
                  type="number"
                  value={formData.vacancy_count}
                  onChange={handleInputChange}
                  className={errors.vacancy_count ? "border-red-500" : ""}
                />
                {errors.vacancy_count && <p className="text-red-500 text-sm">{errors.vacancy_count}</p>}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                className="ml-2"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingJob(null);
                }}
              >
                لغو
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && (
                  <LuLoaderCircle className="animate-spin h-4 w-4  text-white dark:text-black" />
                )}
                {editingJob ? "ویرایش" : "افزودن"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>حذف آگهی</DialogTitle>
          </DialogHeader>
          <p className="my-5">آیا مطمئن هستید که می‌خواهید این آگهی را حذف کنید؟</p>
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