import React  , {useEffect , useState , useContext} from "react"
import axios from "axios"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DataTable } from "@/components/data-table"

import AuthContext from "@/context/authContext"

const userSchema = z.object({
  full_name: z.string().min(1, "نام کامل الزامی است"),
  email: z.string().email("ایمیل نامعتبر است"),
  phone: z.string().min(1, "شماره تلفن الزامی است"),
  username: z.string().min(1, "نام کاربری الزامی است"),
  role: z.enum(["full_admin", "admin", "employer" , "job_seeker"]),
  account_status: z.enum(["فعال", "غیرفعال" , "به تعلیق در آمده"]),
  password: z.string().min(8, "رمز عبور باید حداقل ۶ کاراکتر باشد").optional(),
})

export default function Users() {
  const [users, setUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const authContext = useContext(AuthContext);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    username: "",
    role: "job_seeker",
    account_status: "فعال",
    password: "",
  })
  const [errors, setErrors] = useState({})


  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${authContext.baseUrl}/users`)
      setUsers(response.data)
    } catch (error) {
      toast.error("خطا در دریافت کاربران")
    }
  }


  useEffect(() => {
    fetchUsers()
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
    try {
      const validatedData = userSchema.parse({
        ...formData,
        password: editingUser ? undefined : formData.password,
      })
      setErrors({})

      if (editingUser) {

        await axios.put(`${authContext.baseUrl}/users/${editingUser.id}`, validatedData)
        toast.success("کاربر با موفقیت ویرایش شد")
      } else {

        await axios.post(`${authContext.baseUrl}/users`, validatedData)
        toast.success("کاربر با موفقیت اضافه شد")
      }

      setFormData({
        full_name: "",
        email: "",
        phone: "",
        username: "",
        role: "job_seeker",
        account_status: "فعال",
        password: "",
      })
      setEditingUser(null)
      setIsModalOpen(false)
      fetchUsers()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {}
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message
        })
        setErrors(fieldErrors)
      } else {
        toast.error("خطا در ذخیره کاربر")
      }
    }
  }


  const handleDelete = async (id) => {
    try {
      await axios.delete(`${authContext.baseUrl}/users/${id}`)
      toast.success("کاربر با موفقیت حذف شد")
      fetchUsers()
    } catch (error) {
      toast.error("خطا در حذف کاربر")
    }
  }


  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      username: user.username,
      role: user.role,
      account_status: user.account_status,
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
    { key: "actions", label: "اقدامات" },
  ]

  return (
    <div className="p-4 lg:p-6" dir="rtl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold moraba">مدیریت کاربران</h1>
        <Button onClick={() => setIsModalOpen(true)}>افزودن کاربر</Button>
      </div>
      <DataTable headers={headers} data={users} onEdit={handleEdit} onDelete={handleDelete} />
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingUser ? "ویرایش کاربر" : "افزودن کاربر"}</DialogTitle>
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
                  <SelectItem value="employer">کارمند</SelectItem>
                  <SelectItem value="job_seeker">متغاضی</SelectItem>
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
                  <SelectItem value="غیرفعال">غیرفعال</SelectItem>
                  <SelectItem value="به تعلیق در آمده">به تعلیق در آمده</SelectItem>
                </SelectContent>
              </Select>
              {errors.account_status && (
                <p className="text-red-500 text-sm">{errors.account_status}</p>
              )}
            </div>
            {!editingUser && (
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
                  setEditingUser(null)
                  setFormData({
                    full_name: "",
                    email: "",
                    phone: "",
                    username: "",
                    role: "viewer",
                    account_status: "فعال",
                    password: "",
                  })
                  setErrors({})
                }}
              >
                لغو
              </Button>
              <Button type="submit">{editingUser ? "ویرایش" : "افزودن"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}