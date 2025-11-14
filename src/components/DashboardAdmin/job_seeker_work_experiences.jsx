import React, { useEffect, useState, useContext } from "react";
import useAxios from '@/hooks/useAxios';
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

const workExperienceSchema = z.object({
  title: z.string().min(1, "عنوان شغل الزامی است"),
  company_name: z.string().min(1, "نام شرکت الزامی است"),
  start_date: z.string().min(1, "تاریخ شروع الزامی است"),
  end_date: z.string().min(1, "تاریخ پایان الزامی است"),
  description: z.string().optional(),
  job_seeker_resume_id: z.string().min(1, "انتخاب رزومه الزامی است"),
});

const job_seeker_work_experiences = () => {
  const [workExperiences, setWorkExperiences] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingGetData, setLoadingGetData] = useState(true);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    start_date: "",
    end_date: "",
    description: "",
    job_seeker_resume_id: "",
  });

  const axiosInstance = useAxios();
  const authContext = useContext(AuthContext);

  // Fetch work experiences
  const fetchWorkExperiences = async () => {
    try {
      const response = await axiosInstance.get(`/job_seeker_work_experiences/?offset=0&limit=100`);
      setWorkExperiences(response.data);
      setLoadingGetData(false);
    } catch (error) {
      toast.error("خطا در دریافت تجارب کاری");
      setLoadingGetData(false);
    }
  };

  // Fetch resumes for select
  const fetchResumes = async () => {
    try {
      const response = await axiosInstance.get(`/job_seeker_resumes/?offset=0&limit=100`);
      setResumes(response.data);
    } catch (error) {
      toast.error("خطا در دریافت رزومه‌ها");
    }
  };

  useEffect(() => {
    fetchWorkExperiences();
    fetchResumes();
  }, []);

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
      const validatedData = workExperienceSchema.parse(formData);
      setErrors({});

      if (editingExperience) {
        await axiosInstance.patch(`/job_seeker_work_experiences/${editingExperience.id}`, validatedData);
        toast.success("تجربه کاری با موفقیت ویرایش شد");
      } else {
        await axiosInstance.post(`/job_seeker_work_experiences`, validatedData);
        toast.success("تجربه کاری با موفقیت اضافه شد");
      }

      setFormData({
        title: "",
        company_name: "",
        start_date: "",
        end_date: "",
        description: "",
        job_seeker_resume_id: "",
      });
      setEditingExperience(null);
      setIsModalOpen(false);
      fetchWorkExperiences();
      setLoading(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast.error("خطا در ثبت تجربه کاری");
      }
      setLoading(false);
    }
  };

  const handleEdit = (exp) => {
    setEditingExperience(exp);
    setFormData({
      title: exp.title,
      company_name: exp.company_name,
      start_date: exp.start_date,
      end_date: exp.end_date,
      description: exp.description || "",
      job_seeker_resume_id: exp.resume?.id || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/job_seeker_work_experiences/${id}`);
      toast.success("تجربه کاری با موفقیت حذف شد");
      fetchWorkExperiences();
    } catch (error) {
      toast.error("خطا در حذف تجربه کاری");
    }
    setLoading(false);
  };

  const headers = [
    { key: "title", label: "عنوان شغل" },
    { key: "company_name", label: "نام شرکت" },
    { key: "start_date", label: "تاریخ شروع" },
    { key: "end_date", label: "تاریخ پایان" },
    { key: "description", label: "توضیحات" },
    { key: "resume", label: "رزومه" },
  ];

  return (
    <div className="p-4 lg:p-6" dir="rtl">
      <Toaster className="dana" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold moraba">مدیریت تجارب کاری کارجو</h1>
        <Button onClick={() => {
          setIsModalOpen(true); 
          setEditingExperience(null);
          setFormData({
            title: "",
            company_name: "",
            start_date: "",
            end_date: "",
            description: "",
            job_seeker_resume_id: "",
          });
        }}>
          افزودن تجربه کاری
        </Button>
      </div>
      {
        loadingGetData ? (
          <LuLoaderCircle className="animate-spin h-8 w-8 mx-auto mt-10 text-black dark:text-white" />
        ) : (
          <DataTable
            headers={headers}
            data={workExperiences.map(item => ({
              ...item,
              resume: item.resume?.job_title || ""
            }))}
            onEdit={handleEdit}
            onDelete={exp => handleDelete(exp.id)}
          />
        )
      }
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingExperience ? "ویرایش تجربه کاری" : "افزودن تجربه کاری"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
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
              <Label htmlFor="company_name">نام شرکت</Label>
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                className={errors.company_name ? "border-red-500" : ""}
              />
              {errors.company_name && <p className="text-red-500 text-sm">{errors.company_name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="start_date">تاریخ شروع</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
                className={errors.start_date ? "border-red-500" : ""}
              />
              {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end_date">تاریخ پایان</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleInputChange}
                className={errors.end_date ? "border-red-500" : ""}
              />
              {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">توضیحات</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="job_seeker_resume_id">رزومه</Label>
              <Select
                value={formData.job_seeker_resume_id}
                onValueChange={(value) => handleSelectChange("job_seeker_resume_id", value)}
              >
                <SelectTrigger id="job_seeker_resume_id">
                  <SelectValue placeholder="انتخاب رزومه" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((resume) => (
                    <SelectItem value={resume.id} key={resume.id}>
                      {resume.job_title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.job_seeker_resume_id && <p className="text-red-500 text-sm">{errors.job_seeker_resume_id}</p>}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="ml-2"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingExperience(null);
                  setFormData({
                    title: "",
                    company_name: "",
                    start_date: "",
                    end_date: "",
                    description: "",
                    job_seeker_resume_id: "",
                  });
                }}
              >
                لغو
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && (
                  <LuLoaderCircle className="animate-spin h-4 w-4 text-white dark:text-black" />
                )}
                {editingExperience ? "ویرایش" : "افزودن"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default job_seeker_work_experiences;