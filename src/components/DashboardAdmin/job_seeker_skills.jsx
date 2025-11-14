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

const skillSchema = z.object({
  title: z.string().min(1, "عنوان مهارت الزامی است"),
  proficiency_level: z.enum(["مبتدی", "متوسط", "پیشرفته"], { message: "سطح مهارت الزامی است" }),
  has_certificate: z.boolean(),
  certificate_issuing_organization: z.string().optional(),
  certificate_code: z.string().optional(),
  certificate_verification_status: z.enum(["تایید شده", "رد شده", "در انتظار تایید"], { message: "وضعیت گواهی الزامی است" }),
  job_seeker_resume_id: z.string().min(1, "انتخاب رزومه الزامی است"),
});

const mappings = {
  proficiency_level: {
    "مبتدی": "مبتدی",
    "متوسط": "متوسط",
    "پیشرفته": "پیشرفته"
  },
  certificate_verification_status: {
    "تایید شده": "تایید شده",
    "رد شده": "رد شده",
    "در انتظار تایید": "در انتظار تایید"
  },
};

export default function JobSeekerSkills() {
  const [skills, setSkills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingGetData, setLoadingGetData] = useState(true);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    proficiency_level: "مبتدی",
    has_certificate: false,
    certificate_issuing_organization: "",
    certificate_code: "",
    certificate_verification_status: "تایید شده",
    job_seeker_resume_id: "",
  });

  const axiosInstance = useAxios();
  const authContext = useContext(AuthContext);

  // Fetch skills
  const fetchSkills = async () => {
    try {
      const response = await axiosInstance.get(`/job_seeker_skills/?offset=0&limit=100`);
      setSkills(response.data);
      setLoadingGetData(false);
    } catch (error) {
      toast.error("خطا در دریافت مهارت‌ها");
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
    fetchSkills();
    fetchResumes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if(type === "checkbox"){
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validatedData = skillSchema.parse(formData);
      setErrors({});

      if(editingSkill){
        await axiosInstance.patch(`/job_seeker_skills/${editingSkill.id}`, validatedData);
        toast.success("مهارت با موفقیت ویرایش شد");
      } else {
        await axiosInstance.post(`/job_seeker_skills`, validatedData);
        toast.success("مهارت با موفقیت اضافه شد");
      }

      setFormData({
        title: "",
        proficiency_level: "مبتدی",
        has_certificate: false,
        certificate_issuing_organization: "",
        certificate_code: "",
        certificate_verification_status: "تایید شده",
        job_seeker_resume_id: "",
      });
      setEditingSkill(null);
      setIsModalOpen(false);
      fetchSkills();
      setLoading(false);
    } catch (error) {
      if(error instanceof z.ZodError){
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast.error("خطا در ثبت/ویرایش مهارت");
      }
      setLoading(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      title: skill.title || "",
      proficiency_level: skill.proficiency_level || "مبتدی",
      has_certificate: skill.has_certificate || false,
      certificate_issuing_organization: skill.certificate_issuing_organization || "",
      certificate_code: skill.certificate_code || "",
      certificate_verification_status: skill.certificate_verification_status || "تایید شده",
      job_seeker_resume_id: skill.resume ? skill.resume.id : "",
    });
    setIsModalOpen(true);
  };

  const headers = [
    { key: "title", label: "عنوان مهارت" },
    { key: "proficiency_level", label: "سطح مهارت" },
    { key: "has_certificate", label: "گواهی" , render: (value) => (value ? "✔️" : "➖")},
    { key: "certificate_issuing_organization", label: "سازمان صادر کننده" },
    { key: "certificate_code", label: "کد گواهی" },
    { key: "certificate_verification_status", label: "وضعیت گواهی" },
    { key: "resume.job_title", label: "رزومه (عنوان شغلی)" },
  ];

  return (
    <div className="p-4 lg:p-6" dir="rtl">
      <Toaster className="dana" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold moraba">مدیریت مهارت‌های کارجو</h1>
        <Button onClick={() => {
          setEditingSkill(null);
          setIsModalOpen(true);
        }}>افزودن مهارت</Button>
      </div>
      {
        loadingGetData ? (
          <LuLoaderCircle className="animate-spin h-8 w-8 mx-auto mt-10  text-black dark:text-white" />
        ) : (
          <DataTable
            headers={headers}
            data={skills}
            onEdit={handleEdit}
            valueMappings={mappings}
          />
        )
      }

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingSkill ? "ویرایش مهارت" : "افزودن مهارت"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">عنوان مهارت</Label>
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
              <Label htmlFor="proficiency_level">سطح مهارت</Label>
              <Select
                value={formData.proficiency_level}
                onValueChange={(value) => handleSelectChange("proficiency_level", value)}
              >
                <SelectTrigger id="proficiency_level">
                  <SelectValue placeholder="انتخاب سطح مهارت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مبتدی">مبتدی</SelectItem>
                  <SelectItem value="متوسط">متوسط</SelectItem>
                  <SelectItem value="پیشرفته">پیشرفته</SelectItem>
                </SelectContent>
              </Select>
              {errors.proficiency_level && (
                <p className="text-red-500 text-sm">{errors.proficiency_level}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                id="has_certificate"
                type="checkbox"
                name="has_certificate"
                checked={formData.has_certificate}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <Label htmlFor="has_certificate">گواهی دارد؟</Label>
            </div>
            {formData.has_certificate && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="certificate_issuing_organization">سازمان صادر کننده گواهی</Label>
                  <Input
                    id="certificate_issuing_organization"
                    name="certificate_issuing_organization"
                    value={formData.certificate_issuing_organization}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="certificate_code">کد گواهی</Label>
                  <Input
                    id="certificate_code"
                    name="certificate_code"
                    value={formData.certificate_code}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="certificate_verification_status">وضعیت گواهی</Label>
                  <Select
                    value={formData.certificate_verification_status}
                    onValueChange={(value) => handleSelectChange("certificate_verification_status", value)}
                  >
                    <SelectTrigger id="certificate_verification_status">
                      <SelectValue placeholder="انتخاب وضعیت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="تایید شده">تایید شده</SelectItem>
                      <SelectItem value="رد شده">رد شده</SelectItem>
                      <SelectItem value="در انتظار تایید">در انتظار تایید</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.certificate_verification_status && (
                    <p className="text-red-500 text-sm">{errors.certificate_verification_status}</p>
                  )}
                </div>
              </>
            )}
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
                  {resumes.length > 0 ? resumes.map((resume) => (
                    <SelectItem key={resume.id} value={resume.id}>
                      {resume.job_title}
                    </SelectItem>
                  )) : (
                    <SelectItem value="" disabled>هیچ رزومه‌ای نیست</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.job_seeker_resume_id && (
                <p className="text-red-500 text-sm">{errors.job_seeker_resume_id}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="ml-2"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingSkill(null);
                }}
              >
                لغو
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && (
                  <LuLoaderCircle className="animate-spin h-4 w-4 text-white dark:text-black" />
                )}
                {editingSkill ? "ویرایش" : "افزودن"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}