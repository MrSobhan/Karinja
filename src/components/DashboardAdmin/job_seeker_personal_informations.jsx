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

import AuthContext from "@/context/authContext"

const personalInfoSchema = z.object({
  residence_province: z.string().min(1, "استان محل سکونت الزامی است"),
  residence_address: z.string().min(1, "آدرس محل سکونت الزامی است"),
  marital_status: z.enum(["مجرد", "متاهل"]),
  birth_year: z.number().int().min(1300, "سال تولد معتبر وارد کنید").max(new Date().getFullYear(), "سال تولد معتبر وارد کنید"),
  gender: z.enum(["مرد", "زن"]),
  military_service_status: z.enum(["انجام شده", "معاف", "در حال انجام", "نیاز به انجام"]),
  job_seeker_resume_id: z.string().min(1, "انتخاب رزومه الزامی است"),
})

export default function JobSeekerPersonalInformations() {
  const [personalInfos, setPersonalInfos] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInfo, setEditingInfo] = useState(null)
  const [formData, setFormData] = useState({
    residence_province: "",
    residence_address: "",
    marital_status: "مجرد",
    birth_year: "",
    gender: "مرد",
    military_service_status: "انجام شده",
    job_seeker_resume_id: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [loadingGetData, setLoadingGetData] = useState(true)
  const [resumes, setResumes] = useState([])

  const axiosInstance = useAxios();
  const authContext = useContext(AuthContext);

  const fetchPersonalInfos = async () => {
    try {
      const res = await axiosInstance.get(`/job_seeker_personal_informations/?offset=0&limit=100`)
      setPersonalInfos(res.data)
      setLoadingGetData(false)
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات شخصی")
      setLoadingGetData(false)
    }
  }

  const fetchResumes = async () => {
    try {
      const res = await axiosInstance.get(`/job_seeker_resumes/?offset=0&limit=100`)
      setResumes(res.data)
    } catch (error) {
      toast.error("خطا در دریافت لیست رزومه")
    }
  }

  useEffect(() => {
    fetchPersonalInfos()
    fetchResumes()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const dataToSend = {
        ...formData,
        birth_year: formData.birth_year ? Number(formData.birth_year) : undefined,
      }
      const validatedData = personalInfoSchema.parse(dataToSend)
      setErrors({})

      if (editingInfo) {
        await axiosInstance.patch(`/job_seeker_personal_informations/${editingInfo.id}`, validatedData)
        toast.success("اطلاعات با موفقیت ویرایش شد")
      } else {
        await axiosInstance.post(`/job_seeker_personal_informations`, validatedData)
        toast.success("اطلاعات با موفقیت اضافه شد")
      }

      setFormData({
        residence_province: "",
        residence_address: "",
        marital_status: "مجرد",
        birth_year: "",
        gender: "مرد",
        military_service_status: "انجام شده",
        job_seeker_resume_id: "",
      })
      setEditingInfo(null)
      setIsModalOpen(false)
      fetchPersonalInfos()
      setLoading(false)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {}
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message
        })
        setErrors(fieldErrors)
      } else {
        toast.error("خطا در ذخیره اطلاعات شخصی")
      }
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/job_seeker_personal_informations/${id}`)
      toast.success("اطلاعات با موفقیت حذف شد")
      fetchPersonalInfos()
    } catch (error) {
      toast.error("خطا در حذف اطلاعات شخصی")
    }
  }

  const handleEdit = (info) => {
    setEditingInfo(info)
    setFormData({
      residence_province: info.residence_province || "",
      residence_address: info.residence_address || "",
      marital_status: info.marital_status || "مجرد",
      birth_year: info.birth_year?.toString() || "",
      gender: info.gender || "مرد",
      military_service_status: info.military_service_status || "انجام شده",
      job_seeker_resume_id: info.job_seeker_resume ? info.job_seeker_resume.id : "",
    })
    setIsModalOpen(true)
  }

  // Add columns for name and username to table headers
  const headers = [
    { key: "job_seeker.full_name", label: "نام و نام خانوادگی" },
    { key: "job_seeker.user.username", label: "نام کاربری" },
    { key: "residence_province", label: "استان محل سکونت" },
    { key: "residence_address", label: "آدرس" },
    { key: "marital_status", label: "وضعیت تاهل" },
    { key: "birth_year", label: "سال تولد" },
    { key: "gender", label: "جنسیت" },
    { key: "military_service_status", label: "وضعیت خدمت سربازی" },
    { key: "job_seeker_resume.job_title", label: "عنوان رزومه" },
  ];

  const mappings = {
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
  };

  return (
    <div className="p-4 lg:p-6" dir="rtl">
      <Toaster className="dana" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold moraba">مدیریت اطلاعات شخصی کارجو</h1>
        <Button onClick={() => {
          setEditingInfo(null)
          setIsModalOpen(true)
        }}>افزودن اطلاعات شخصی</Button>
      </div>
      {
        loadingGetData ? (
          <LuLoaderCircle className="animate-spin h-8 w-8 mx-auto mt-10 text-black dark:text-white" />
        ) : (
          <DataTable headers={headers} data={personalInfos} onEdit={handleEdit} onDelete={handleDelete} valueMappings={mappings} />
        )
      }

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingInfo ? "ویرایش اطلاعات" : "افزودن اطلاعات شخصی"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="residence_province">استان محل سکونت</Label>
              <Input
                id="residence_province"
                name="residence_province"
                value={formData.residence_province}
                onChange={handleInputChange}
                className={errors.residence_province ? "border-red-500" : ""}
              />
              {errors.residence_province && <p className="text-red-500 text-sm">{errors.residence_province}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="residence_address">آدرس محل سکونت</Label>
              <Input
                id="residence_address"
                name="residence_address"
                value={formData.residence_address}
                onChange={handleInputChange}
                className={errors.residence_address ? "border-red-500" : ""}
              />
              {errors.residence_address && <p className="text-red-500 text-sm">{errors.residence_address}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="marital_status">وضعیت تاهل</Label>
              <Select
                value={formData.marital_status}
                onValueChange={(value) => handleSelectChange('marital_status', value)}
              >
                <SelectTrigger id="marital_status">
                  <SelectValue placeholder="انتخاب وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مجرد">مجرد</SelectItem>
                  <SelectItem value="متاهل">متاهل</SelectItem>
                </SelectContent>
              </Select>
              {errors.marital_status && <p className="text-red-500 text-sm">{errors.marital_status}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="birth_year">سال تولد</Label>
              <Input
                id="birth_year"
                name="birth_year"
                type="number"
                value={formData.birth_year}
                onChange={handleInputChange}
                className={errors.birth_year ? "border-red-500" : ""}
              />
              {errors.birth_year && <p className="text-red-500 text-sm">{errors.birth_year}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gender">جنسیت</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange('gender', value)}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="انتخاب جنسیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مرد">مرد</SelectItem>
                  <SelectItem value="زن">زن</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="military_service_status">وضعیت خدمت سربازی</Label>
              <Select
                value={formData.military_service_status}
                onValueChange={(value) => handleSelectChange('military_service_status', value)}
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
              {errors.military_service_status && <p className="text-red-500 text-sm">{errors.military_service_status}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="job_seeker_resume_id">انتخاب رزومه</Label>
              <Select
                value={formData.job_seeker_resume_id}
                onValueChange={(value) => handleSelectChange("job_seeker_resume_id", value)}
              >
                <SelectTrigger id="job_seeker_resume_id">
                  <SelectValue placeholder="انتخاب رزومه" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((resume) => (
                    <SelectItem key={resume.id} value={resume.id}>
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
                  setEditingInfo(null)
                }}
              >
                لغو
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && (
                  <LuLoaderCircle className="animate-spin h-4 w-4 text-white dark:text-black" />
                )}
                {editingInfo ? "ویرایش" : "افزودن"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}