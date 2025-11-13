import React, { useEffect, useState, useContext } from "react"
import useAxios from '@/hooks/useAxios';
import { toast, Toaster } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter ,DialogDescription } from "@/components/ui/dialog"
import { DataTable } from "@/components/data-table"
import { LuLoaderCircle } from "react-icons/lu";
import AuthContext from "@/context/authContext"

const adminSchema = z.object({
  full_name: z.string().min(1, "نام کامل الزامی است"),
  email: z.string().email("ایمیل نامعتبر است"),
  phone: z.string().min(1, "شماره تلفن الزامی است"),
  username: z.string().min(1, "نام کاربری الزامی است"),
  role: z.enum(["full_admin", "admin"]),
  account_status: z.enum(["فعال", "غیر فعال", "به تعلیق در آمده"]),
  password: z.string().min(4, "رمز عبور باید حداقل 4 کاراکتر باشد").optional(),
})

export default function Admin() {
  const [admins, setAdmins] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const authContext = useContext(AuthContext);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    username: "",
    role: "admin",
    account_status: "فعال",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false);
  const [loadingGetData, setLoadingGetData] = useState(true);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const axiosInstance = useAxios();


  const fetchAdmins = async () => {
    try {
      const response = await axiosInstance.get(`/users/search/?role=admin&operator=and&offset=0&limit=100`)

      const responseFullAdmins = await axiosInstance.get(`/users/search/?role=full_admin&operator=and&offset=0&limit=100`)
      setAdmins([
        ...response.data,
        ...responseFullAdmins.data
      ])
      setLoadingGetData(false)
    } catch (error) {
      console.log(error);
      toast.error("خطا در دریافت ادمین‌ها")
    }
  }


  useEffect(() => {
    fetchAdmins()
  }, [])


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }


  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    try {
      const validatedData = adminSchema.parse({
        ...formData,
        password: editingAdmin ? undefined : formData.password,
      })
      setErrors({})

      if (editingAdmin) {
        await axiosInstance.patch(`/users/${editingAdmin.id}`, validatedData)
        toast.success("ادمین با موفقیت ویرایش شد")
      } else {
        await axiosInstance.post(`/users`, validatedData)
        toast.success("ادمین با موفقیت اضافه شد")
      }

      setFormData({
        full_name: "",
        email: "",
        phone: "",
        username: "",
        role: "admin",
        account_status: "فعال",
        password: "",
      })
      setEditingAdmin(null)
      setIsModalOpen(false)
      fetchAdmins()
      setLoading(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {}
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message
        })
        setErrors(fieldErrors)
      } else {
        toast.error("خطا در ذخیره ادمین")
      }
      setLoading(false);
    }
  }

  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const resDelete = await axiosInstance.delete(`/users/${deleteTargetId}`);
      toast.success("ادمین با موفقیت حذف شد");
      fetchAdmins();
    } catch (error) {
      toast.error("خطا در حذف ادمین");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
    }
  };


  const handleEdit = (admin) => {
    setEditingAdmin(admin)
    setFormData({
      full_name: admin.full_name,
      email: admin.email,
      phone: admin.phone,
      username: admin.username,
      role: admin.role,
      account_status: admin.account_status,
      password: "",
    })
    setIsModalOpen(true)
  }


  const headers = [
    { key: "full_name", label: "نام کامل" },
    { key: "email", label: "ایمیل" },
    { key: "phone", label: "شماره تلفن" },
    { key: "username", label: "نام کاربری" },
    { key: "role", label: "نقش" },
    { key: "account_status", label: "وضعیت حساب" },
  ]

  const mappings = {
    role: {
      full_admin: "مدیر عامل",
      admin: "ادمین",
    }
  };

  return (
    <div className="p-4 lg:p-6" dir="rtl">
      <Toaster className="dana" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold moraba">مدیریت ادمین‌ها</h1>
        <Button onClick={() => setIsModalOpen(true)}>افزودن ادمین</Button>
      </div>
      {
        loadingGetData ? (
          <LuLoaderCircle className="animate-spin h-8 w-8 mx-auto mt-10  text-black dark:text-white" />
        ) : (
          <DataTable headers={headers} data={admins} onEdit={handleEdit} onDelete={handleDeleteClick} valueMappings={mappings} />
        )
      }
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingAdmin ? "ویرایش ادمین" : "افزودن ادمین"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name">نام کامل</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className={errors.full_name ? "border-red-500" : ""}
              />
              {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">شماره تلفن</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">نام کاربری</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">نقش</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="انتخاب نقش" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_admin">مدیر عامل</SelectItem>
                  <SelectItem value="admin">ادمین</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="account_status">وضعیت حساب</Label>
              <Select
                value={formData.account_status}
                onValueChange={(value) => handleSelectChange("account_status", value)}
              >
                <SelectTrigger id="account_status">
                  <SelectValue placeholder="انتخاب وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="فعال">فعال</SelectItem>
                  <SelectItem value="غیر فعال">غیر فعال</SelectItem>
                  <SelectItem value="به تعلیق در آمده">به تعلیق در آمده</SelectItem>
                </SelectContent>
              </Select>
              {errors.account_status && (
                <p className="text-red-500 text-sm">{errors.account_status}</p>
              )}
            </div>
            {!editingAdmin && (
              <div className="grid gap-2">
                <Label htmlFor="password">رمز عبور</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
            )}
            <DialogFooter>

              <Button
                variant="outline"
                className="ml-2"
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingAdmin(null)
                }}
              >
                لغو
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && (
                  <LuLoaderCircle className="animate-spin h-4 w-4  text-white dark:text-black" />
                )}
                {editingAdmin ? "ویرایش" : "افزودن"}
              </Button>

            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>حذف ادمین</DialogTitle>
          </DialogHeader>
          <p className="my-5">آیا مطمئن هستید که می‌خواهید این ادمین را حذف کنید؟</p>
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
  )
}