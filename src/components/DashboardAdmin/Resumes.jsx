import React, { useEffect, useState, useContext } from "react"
import useAxios from '@/hooks/useAxios';
import { toast, Toaster } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DataTable } from "@/components/data-table"
import { LuLoaderCircle } from "react-icons/lu";
import { Switch } from "@/components/ui/switch"
import AuthContext from "@/context/authContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const resumeSchema = z.object({
  job_title: z.string().min(1, "عنوان شغلی الزامی است"),
  professional_summary: z.string().min(1, "خلاصه حرفه‌ای الزامی است"),
  employment_status: z.enum(["کارجو", "شاغل", "بیکار"]),
  is_visible: z.boolean(),
  user_id: z.string().uuid("شناسه کاربر نامعتبر است"),
})

const personalInfoSchema = z.object({
  residence_province: z.string().min(1, "استان محل سکونت الزامی است"),
  residence_address: z.string().min(1, "آدرس محل سکونت الزامی است"),
  marital_status: z.enum(["مجرد", "متاهل"]),
  birth_year: z.number().min(1900, "سال تولد نامعتبر است"),
  gender: z.enum(["مرد", "زن"]),
  military_service_status: z.enum(["انجام شده", "معاف", "در حال انجام", "نیاز به انجام"]),
})

export default function Resumes() {
  const [resumes, setResumes] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedResume, setSelectedResume] = useState(null)
  const [editingResume, setEditingResume] = useState(null)
  const authContext = useContext(AuthContext)
  const [formData, setFormData] = useState({
    job_title: "",
    professional_summary: "",
    employment_status: "کارجو",
    is_visible: true,
    user_id: "",
  })
  const [personalInfoData, setPersonalInfoData] = useState({
    residence_province: "",
    residence_address: "",
    marital_status: "مجرد",
    birth_year: 0,
    gender: "مرد",
    military_service_status: "انجام شده",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [loadingGetData, setLoadingGetData] = useState(true)

  const axiosInstance = useAxios()

  const fetchResumes = async () => {
    try {
      const response = await axiosInstance.get(`/job_seeker_resumes`)
      
      setResumes(response.data)
      setLoadingGetData(false)
    } catch (error) {
      toast.error("خطا در دریافت رزومه‌ها")
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target
    setPersonalInfoData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePersonalInfoSelectChange = (name, value) => {
    setPersonalInfoData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({ ...prev, is_visible: checked }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const validatedData = resumeSchema.parse(formData)
      const validatedPersonalInfo = personalInfoSchema.parse(personalInfoData)
      setErrors({})

      const payload = {
        ...validatedData,
        job_seeker_personal_information: validatedPersonalInfo,
      }

      if (editingResume) {
        await axiosInstance.patch(`/job_seeker_resumes/${editingResume.id}`, payload)
        toast.success("رزومه با موفقیت ویرایش شد")
      } else {
        await axiosInstance.post(`/job_seeker_resumes`, payload)
        toast.success("رزومه با موفقیت اضافه شد")
      }

      setFormData({
        job_title: "",
        professional_summary: "",
        employment_status: "کارجو",
        is_visible: true,
        user_id: "",
      })
      setPersonalInfoData({
        residence_province: "",
        residence_address: "",
        marital_status: "مجرد",
        birth_year: 0,
        gender: "مرد",
        military_service_status: "انجام شده",
      })
      setEditingResume(null)
      setIsModalOpen(false)
      fetchResumes()
      setLoading(false)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {}
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message
        })
        setErrors(fieldErrors)
      } else {
        toast.error("خطا در ذخیره رزومه")
      }
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/job_seeker_resumes/${id}`)
      toast.success("رزومه با موفقیت حذف شد")
      fetchResumes()
    } catch (error) {
      toast.error("خطا در حذف رزومه")
    }
  }

  const handleEdit = (resume) => {
    setEditingResume(resume)
    setFormData({
      job_title: resume.job_title,
      professional_summary: resume.professional_summary,
      employment_status: resume.employment_status,
      is_visible: resume.is_visible,
      user_id: resume.user_id,
    })
    setPersonalInfoData(resume.job_seeker_personal_information)
    setIsModalOpen(true)
  }

  const handleViewDetails = (resume) => {
    setSelectedResume(resume)
    setIsDetailsModalOpen(true)
  }

  const headers = [
    { key: "job_title", label: "عنوان شغلی" },
    { key: "professional_summary", label: "خلاصه حرفه‌ای" },
    { key: "employment_status", label: "وضعیت شغلی" },
    { key: "is_visible", label: "قابلیت نمایش", render: (value) => (value ? "✔️" : "➖") },
    { key: "user.full_name", label: "نام کاربر" },
    {
      key: "details",
      label: "جزئیات",
      render: (_, row) => (
        <Button variant="outline" onClick={() => handleViewDetails(row)}>
          مشاهده جزئیات
        </Button>
      ),
    },
  ]

  const mappings = {
    employment_status: {
      کارجو: "کارجو",
      شاغل: "شاغل",
      بیکار: "بیکار",
    },
    marital_status: {
      مجرد: "مجرد",
      متاهل: "متاهل",
    },
    gender: {
      مرد: "مرد",
      زن: "زن",
    },
    military_service_status: {
      "انجام شده": "انجام شده",
      "معاف": "معاف",
      "در حال انجام": "در حال انجام",
      "نیاز به انجام": "نیاز به انجام",
    },
  }

  return (
    <div className="p-4 lg:p-6" dir="rtl">
      <Toaster className="dana" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold moraba">مدیریت رزومه‌ها</h1>
        <Button onClick={() => setIsModalOpen(true)}>افزودن رزومه</Button>
      </div>
      {loadingGetData ? (
        <LuLoaderCircle className="animate-spin h-8 w-8 mx-auto mt-10 text-black dark:text-white" />
      ) : (
        <DataTable
          headers={headers}
          data={resumes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          valueMappings={mappings}
        />
      )}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingResume ? "ویرایش رزومه" : "افزودن رزومه"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">

            <div className="grid gap-4 grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="job_title">عنوان شغلی</Label>
                <Input
                  id="job_title"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleInputChange}
                  className={errors.job_title ? "border-red-500" : ""}
                />
                {errors.job_title && <p className="text-red-500 text-sm">{errors.job_title}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="professional_summary">خلاصه حرفه‌ای</Label>
                <Input
                  id="professional_summary"
                  name="professional_summary"
                  value={formData.professional_summary}
                  onChange={handleInputChange}
                  className={errors.professional_summary ? "border-red-500" : ""}
                />
                {errors.professional_summary && (
                  <p className="text-red-500 text-sm">{errors.professional_summary}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="employment_status">وضعیت شغلی</Label>
                <Select
                  value={formData.employment_status}
                  onValueChange={(value) => handleSelectChange("employment_status", value)}
                >
                  <SelectTrigger id="employment_status">
                    <SelectValue placeholder="انتخاب وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="کارجو">کارجو</SelectItem>
                    <SelectItem value="شاغل">شاغل</SelectItem>
                    <SelectItem value="بیکار">بیکار</SelectItem>
                  </SelectContent>
                </Select>
                {errors.employment_status && (
                  <p className="text-red-500 text-sm">{errors.employment_status}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="is_visible">قابلیت نمایش</Label>
                <Switch
                  id="is_visible"
                  checked={formData.is_visible}
                  onCheckedChange={handleSwitchChange}
                />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="user_id">شناسه کاربر</Label>
                <Input
                  id="user_id"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleInputChange}
                  className={errors.user_id ? "border-red-500" : ""}
                />
                {errors.user_id && <p className="text-red-500 text-sm">{errors.user_id}</p>}
              </div>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="residence_province">استان محل سکونت</Label>
                <Input
                  id="residence_province"
                  name="residence_province"
                  value={personalInfoData.residence_province}
                  onChange={handlePersonalInfoChange}
                  className={errors.residence_province ? "border-red-500" : ""}
                />
                {errors.residence_province && (
                  <p className="text-red-500 text-sm">{errors.residence_province}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="residence_address">آدرس محل سکونت</Label>
                <Input
                  id="residence_address"
                  name="residence_address"
                  value={personalInfoData.residence_address}
                  onChange={handlePersonalInfoChange}
                  className={errors.residence_address ? "border-red-500" : ""}
                />
                {errors.residence_address && (
                  <p className="text-red-500 text-sm">{errors.residence_address}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="marital_status">وضعیت تاهل</Label>
                <Select
                  value={personalInfoData.marital_status}
                  onValueChange={(value) => handlePersonalInfoSelectChange("marital_status", value)}
                >
                  <SelectTrigger id="marital_status">
                    <SelectValue placeholder="انتخاب وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مجرد">مجرد</SelectItem>
                    <SelectItem value="متاهل">متاهل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="birth_year">سال تولد</Label>
                <Input
                  id="birth_year"
                  name="birth_year"
                  type="number"
                  value={personalInfoData.birth_year}
                  onChange={handlePersonalInfoChange}
                  className={errors.birth_year ? "border-red-500" : ""}
                />
                {errors.birth_year && <p className="text-red-500 text-sm">{errors.birth_year}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">جنسیت</Label>
                <Select
                  value={personalInfoData.gender}
                  onValueChange={(value) => handlePersonalInfoSelectChange("gender", value)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="انتخاب جنسیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مرد">مرد</SelectItem>
                    <SelectItem value="زن">زن</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="military_service_status">وضعیت خدمت سربازی</Label>
                <Select
                  value={personalInfoData.military_service_status}
                  onValueChange={(value) =>
                    handlePersonalInfoSelectChange("military_service_status", value)
                  }
                >
                  <SelectTrigger id="military_service_status">
                    <SelectValue placeholder="انتخاب وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="انجام شده">انجام شده</SelectItem>
                    <SelectItem value="معاف">معاف</SelectItem>
                    <SelectItem value="در حال انجام">در حال انجام</SelectItem>
                    <SelectItem value="نیاز به انجام">نیاز به انجام</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="ml-2"
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingResume(null)
                }}
              >
                لغو
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && (
                  <LuLoaderCircle className="animate-spin h-4 w-4 text-white dark:text-black" />
                )}
                {editingResume ? "ویرایش" : "افزودن"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>جزئیات رزومه</DialogTitle>
          </DialogHeader>
          {selectedResume && (
            <div className="grid gap-4 py-4">
              <Card>
                <CardHeader>
                  <CardTitle>اطلاعات کاربر</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>نام کامل: {selectedResume.user.full_name}</p>
                  <p>ایمیل: {selectedResume.user.email}</p>
                  <p>شماره تلفن: {selectedResume.user.phone}</p>
                  <p>نام کاربری: {selectedResume.user.username}</p>
                  <p>نقش: {mappings.role?.[selectedResume.user.role] || selectedResume.user.role}</p>
                  <p>وضعیت حساب: {selectedResume.user.account_status}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>اطلاعات شخصی</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>استان محل سکونت: {selectedResume.job_seeker_personal_information.residence_province}</p>
                  <p>آدرس: {selectedResume.job_seeker_personal_information.residence_address}</p>
                  <p>وضعیت تاهل: {selectedResume.job_seeker_personal_information.marital_status}</p>
                  <p>سال تولد: {selectedResume.job_seeker_personal_information.birth_year}</p>
                  <p>جنسیت: {selectedResume.job_seeker_personal_information.gender}</p>
                  <p>وضعیت خدمت: {selectedResume.job_seeker_personal_information.military_service_status}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>مهارت‌ها</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedResume.job_seeker_skills.length > 0 ? (
                    selectedResume.job_seeker_skills.map((skill, index) => (
                      <p key={index}>{skill.name}</p>
                    ))
                  ) : (
                    <p>بدون مهارت</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>تجارب کاری</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedResume.job_seeker_work_experiences.length > 0 ? (
                    selectedResume.job_seeker_work_experiences.map((exp, index) => (
                      <p key={index}>{exp.title}</p>
                    ))
                  ) : (
                    <p>بدون تجربه کاری</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>تحصیلات</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedResume.job_seeker_educations.length > 0 ? (
                    selectedResume.job_seeker_educations.map((edu, index) => (
                      <p key={index}>{edu.degree}</p>
                    ))
                  ) : (
                    <p>بدون تحصیلات</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>درخواست‌های شغلی</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedResume.job_applications.length > 0 ? (
                    selectedResume.job_applications.map((app, index) => (
                      <p key={index}>{app.job_title}</p>
                    ))
                  ) : (
                    <p>بدون درخواست شغلی</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
              بستن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}