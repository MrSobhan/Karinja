import React, { useEffect, useState, useContext } from "react"
import useAxios from "@/hooks/useAxios";
import { toast, Toaster } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DataTable } from "@/components/data-table"
import { LuLoaderCircle } from "react-icons/lu";

import AuthContext from "@/context/authContext"

const educationSchema = z.object({
  institution_name: z.string().min(1, "نام موسسه تحصیلی الزامی است"),
  degree: z.enum(["دبستان", "دیپلم", "کاردانی", "کارشناسی", "کارشناسی ارشد", "دکتری", "سایر"]),
  study_field: z.string().min(1, "رشته تحصیلی الزامی است"),
  start_date: z.string().min(1, "تاریخ شروع الزامی است"),
  end_date: z.string().min(1, "تاریخ پایان الزامی است"),
  description: z.string().optional(),
  job_seeker_resume_id: z.string().min(1, "انتخاب رزومه الزامی است"),
})

const job_seeker_education = () => {
  const [educations, setEducations] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEducation, setEditingEducation] = useState(null)
  const authContext = useContext(AuthContext);
  const [formData, setFormData] = useState({
    institution_name: "",
    degree: "دبستان",
    study_field: "",
    start_date: "",
    end_date: "",
    description: "",
    job_seeker_resume_id: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false);
  const [loadingGetData, setLoadingGetData] = useState(true);

  const [resumes, setResumes] = useState([])

  const axiosInstance = useAxios();

  // Fetch educations
  const fetchEducations = async () => {
    try {
      const response = await axiosInstance.get(`/job_seeker_educations/?offset=0&limit=100`)
      setEducations(response.data)
      setLoadingGetData(false)
    } catch (error) {
      toast.error("خطا در دریافت سوابق تحصیلی")
      setLoadingGetData(false)
    }
  }

  // Fetch resumes for select
  const fetchResumes = async () => {
    try {
      const response = await axiosInstance.get(`/job_seeker_resumes/?offset=0&limit=100`)
      setResumes(response.data)
    } catch (error) {
      toast.error("خطا در دریافت رزومه‌ها")
    }
  }

  useEffect(() => {
    fetchEducations()
    fetchResumes()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validatedData = educationSchema.parse(formData)
      setErrors({})
      if (editingEducation) {
        await axiosInstance.patch(`/job_seeker_educations/${editingEducation.id}`, validatedData)
        toast.success("سوابق با موفقیت ویرایش شد")
      } else {
        await axiosInstance.post(`/job_seeker_educations`, validatedData)
        toast.success("سابقه تحصیلی با موفقیت اضافه شد")
      }
      setFormData({
        institution_name: "",
        degree: "دبستان",
        study_field: "",
        start_date: "",
        end_date: "",
        description: "",
        job_seeker_resume_id: "",
      })
      setEditingEducation(null)
      setIsModalOpen(false)
      fetchEducations()
      setLoading(false)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {}
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message
        })
        setErrors(fieldErrors)
      } else {
        toast.error("خطا در ذخیره سابقه تحصیلی")
      }
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/job_seeker_educations/${id}`)
      toast.success("سابقه تحصیلی با موفقیت حذف شد")
      fetchEducations()
    } catch (error) {
      toast.error("خطا در حذف سابقه تحصیلی")
    }
  }

  const handleEdit = (education) => {
    setEditingEducation(education)
    setFormData({
      institution_name: education.institution_name || "",
      degree: education.degree || "دبستان",
      study_field: education.study_field || "",
      start_date: education.start_date || "",
      end_date: education.end_date || "",
      description: education.description || "",
      job_seeker_resume_id: education.resume ? education.resume.id : "",
    })
    setIsModalOpen(true)
  }

  const headers = [
    { key: "institution_name", label: "نام موسسه" },
    { key: "degree", label: "مدرک" },
    { key: "study_field", label: "رشته تحصیلی" },
    { key: "start_date", label: "تاریخ شروع" },
    { key: "end_date", label: "تاریخ پایان" },
    { key: "description", label: "توضیحات" },
    { key: "resume.job_title", label: "رزومه (عنوان شغلی)" },
  ]

  return (
    <div className="p-4 lg:p-6" dir="rtl">
      <Toaster className="dana" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold moraba">مدیریت سوابق تحصیلی کارجو</h1>
        <Button onClick={() => {
          setEditingEducation(null);
          setIsModalOpen(true)
        }}>افزودن سابقه تحصیلی</Button>
      </div>
      {
        loadingGetData ? (
          <LuLoaderCircle className="animate-spin h-8 w-8 mx-auto mt-10 text-black dark:text-white" />
        ) : (
          <DataTable
            headers={headers}
            data={educations}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )
      }
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingEducation ? "ویرایش سابقه تحصیلی" : "افزودن سابقه تحصیلی"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="institution_name">نام موسسه تحصیلی</Label>
              <Input
                id="institution_name"
                name="institution_name"
                value={formData.institution_name}
                onChange={handleInputChange}
                className={errors.institution_name ? "border-red-500" : ""}
              />
              {errors.institution_name && <p className="text-red-500 text-sm">{errors.institution_name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="degree">مدرک</Label>
              <Select
                value={formData.degree}
                onValueChange={(value) => handleSelectChange("degree", value)}
              >
                <SelectTrigger id="degree">
                  <SelectValue placeholder="انتخاب مدرک" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="دبستان">دبستان</SelectItem>
                  <SelectItem value="دیپلم">دیپلم</SelectItem>
                  <SelectItem value="کاردانی">کاردانی</SelectItem>
                  <SelectItem value="کارشناسی">کارشناسی</SelectItem>
                  <SelectItem value="کارشناسی ارشد">کارشناسی ارشد</SelectItem>
                  <SelectItem value="دکتری">دکتری</SelectItem>
                  <SelectItem value="سایر">سایر</SelectItem>
                </SelectContent>
              </Select>
              {errors.degree && <p className="text-red-500 text-sm">{errors.degree}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="study_field">رشته تحصیلی</Label>
              <Input
                id="study_field"
                name="study_field"
                value={formData.study_field}
                onChange={handleInputChange}
                className={errors.study_field ? "border-red-500" : ""}
              />
              {errors.study_field && <p className="text-red-500 text-sm">{errors.study_field}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="start_date">تاریخ شروع</Label>
              <Input
                id="start_date"
                name="start_date"
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
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="job_seeker_resume_id">رزومه مربوطه</Label>
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
                  setIsModalOpen(false)
                  setEditingEducation(null)
                }}
                type="button"
              >
                لغو
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && (
                  <LuLoaderCircle className="animate-spin h-4 w-4 text-white dark:text-black" />
                )}
                {editingEducation ? "ویرایش" : "افزودن"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default job_seeker_education;