import React, { useEffect, useState, useContext } from "react";
import useAxios from "@/hooks/useAxios";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/data-table";
import { LuLoaderCircle } from "react-icons/lu";
import AuthContext from "@/context/authContext";

// Form initial state: all fields empty for "add company" modal
const initialFormData = {
    registration_number: "",
    full_name: "",
    summary: "",
    industry: "",
    ownership_type: "",
    website_address: "",
    founded_year: "",
    employee_count: "",
    address: "",
    phone: "",
    description: "",
    user_id: "",
};

const industriesOptions = [
    "کشاورزی",
    "دامداری",
    "شیلات",
    "معادن",
    "جنگلداری",
    "صنایع تولیدی",
    "صنایع ساخت‌وساز",
    "صنایع شیمیایی",
    "صنایع انرژی",
    "خدمات تجاری",
    "خدمات مالی",
    "خدمات بهداشتی",
    "خدمات آموزشی",
    "خدمات ارتباطی",
    "گردشگری و تفریحی",
    "فناوری اطلاعات",
    "تحقیق و توسعه",
    "مشاوره و خدمات حرفه‌ای",
    "آموزش‌های پیشرفته و تخصصی",
    "خدمات مدیریت عالی",
    "آموزش‌های عالی و تخصصی",
    "مراقبت‌های پزشکی تخصصی",
    "هنر و فرهنگ",
    "تحقیقات و نوآوری‌های پیشرفته",
    "سایر",
];

const ownershipTypes = [
    "خصوصی",
    "عمومی",
    "تعاونی",
    "مختلط",
    "دولتی",
    "بخش خصوصی",
    "مشارکت عمومی-خصوصی",
    "غیرانتفاعی",
    "شرکتی",
];

const employeeCounts = [
    "1-50",
    "51-200",
    "201-1000",
    "1001+",
];

const employerCompanySchema = z.object({
    registration_number: z.string().min(1, "شناسه ثبت الزامی است"),
    full_name: z.string().min(1, "نام شرکت الزامی است"),
    summary: z.string().min(1, "خلاصه شرکت الزامی است"),
    industry: z.string().min(1, "زمینه فعالیت الزامی است"),
    ownership_type: z.enum(ownershipTypes),
    website_address: z.string().url("آدرس وبسایت نامعتبر است").optional().or(z.literal("")),
    founded_year: z.coerce.number().min(1000, "سال تأسیس معتبر نیست"),
    employee_count: z.enum(employeeCounts),
    address: z.string().min(1, "آدرس الزامی است"),
    phone: z.string().min(1, "شماره تماس الزامی است"),
    description: z.string().optional()
});

export default function EmployerCompany() {
    const [companies, setCompanies] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingGetData, setLoadingGetData] = useState(true);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const axiosInstance = useAxios();

    // Fetch all companies
    const fetchCompanies = async () => {
        try {
            const response = await axiosInstance.get(`/employer_companies`);
            console.log("EmployerCompany");
            
            setCompanies(response.data);
            setLoadingGetData(false);
        } catch (error) {
            toast.error("خطا در دریافت شرکت‌ها");
            setLoadingGetData(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
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
            const validatedData = employerCompanySchema.parse({
                ...formData,
                user_id: formData.user_id,
            });
            setErrors({});
            if (editingCompany) {
                await axiosInstance.patch(`/employer_companies/${editingCompany.id}`, validatedData);
                toast.success("شرکت با موفقیت ویرایش شد");
            } else {
                await axiosInstance.post(`/employer_companies`, validatedData);
                toast.success("شرکت با موفقیت اضافه شد");
            }

            setFormData(initialFormData);
            setEditingCompany(null);
            setIsModalOpen(false);
            fetchCompanies();
            setLoading(false);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = {};
                error.errors.forEach((err) => {
                    fieldErrors[err.path[0]] = err.message;
                });
                setErrors(fieldErrors);
            } else {
                toast.error("خطا در ذخیره شرکت");
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
            await axiosInstance.delete(`/employer_companies/${deleteTargetId}`);
            toast.success("شرکت با موفقیت حذف شد");
            fetchCompanies();
        } catch (error) {
            toast.error("خطا در حذف شرکت");
        } finally {
            setDeleteDialogOpen(false);
            setDeleteTargetId(null);
        }
    };

    const handleEdit = (company) => {
        setEditingCompany(company);
        setFormData({
            registration_number: company.registration_number ?? "",
            full_name: company.full_name ?? "",
            summary: company.summary ?? "",
            industry: company.industry ?? "",
            ownership_type: company.ownership_type ?? "",
            website_address: company.website_address ?? "",
            founded_year: company.founded_year ?? "",
            employee_count: company.employee_count ?? "",
            address: company.address ?? "",
            phone: company.phone ?? "",
            description: company.description ?? "",
            user_id: company.user?.id ?? "",
        });
        setIsModalOpen(true);
    };

    // Open 'add company' modal: reset formData & editingCompany
    const handleAddClick = () => {
        setEditingCompany(null);
        setFormData(initialFormData);
        setErrors({});
        setIsModalOpen(true);
    };

    const headers = [
        { key: "registration_number", label: "شناسه ثبت" },
        { key: "full_name", label: "نام شرکت" },
        { key: "industry", label: "زمینه فعالیت" },
        { key: "ownership_type", label: "نوع مالکیت" },
        { key: "founded_year", label: "سال تأسیس" },
        { key: "employee_count", label: "تعداد کارکنان" },
        { key: "phone", label: "شماره تماس" },
        { key: "user", label: "مدیر شرکت" },
    ];

    const mappings = {
        ownership_type: {
            ...ownershipTypes
        },
        employee_count: {
            "1-50": "۱-۵۰",
            "51-200": "۵۱-۲۰۰",
            "201-1000": "۲۰۱-۱۰۰۰",
            "1001+": "بیش از ۱۰۰۰",
        },
        user: {},
    };
    const companyData = companies.map((item) => ({
        ...item,
        user: item.user?.full_name ?? "",
    }));

    return (
        <div className="p-4 lg:p-6" dir="rtl">
            <Toaster className="dana" />
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold moraba">مدیریت شرکت‌ها</h1>
                <Button onClick={handleAddClick}>افزودن شرکت</Button>
            </div>
            {loadingGetData ? (
                <LuLoaderCircle className="animate-spin h-8 w-8 mx-auto mt-10 text-black dark:text-white" />
            ) : (
                <DataTable
                    headers={headers}
                    data={companyData}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    valueMappings={mappings}
                />
            )}

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[540px]" dir="rtl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCompany ? "ویرایش شرکت" : "افزودن شرکت"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-2">

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="registration_number">شناسه ثبت شرکت</Label>
                                <Input
                                    id="registration_number"
                                    name="registration_number"
                                    value={formData.registration_number}
                                    onChange={handleInputChange}
                                    className={errors.registration_number ? "border-red-500" : ""}
                                />
                                {errors.registration_number && (
                                    <p className="text-red-500 text-sm">{errors.registration_number}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="full_name">نام شرکت</Label>
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    className={errors.full_name ? "border-red-500" : ""}
                                />
                                {errors.full_name && (
                                    <p className="text-red-500 text-sm">{errors.full_name}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="industry">زمینه فعالیت</Label>
                                <Select
                                    value={formData.industry}
                                    onValueChange={(value) => handleSelectChange("industry", value)}
                                >
                                    <SelectTrigger id="industry">
                                        <SelectValue placeholder="انتخاب زمینه فعالیت" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {industriesOptions.map((opt) => (
                                            <SelectItem key={opt} value={opt}>
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.industry && (
                                    <p className="text-red-500 text-sm">{errors.industry}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="ownership_type">نوع مالکیت</Label>
                                <Select
                                    value={formData.ownership_type}
                                    onValueChange={(value) => handleSelectChange("ownership_type", value)}
                                >
                                    <SelectTrigger id="ownership_type">
                                        <SelectValue placeholder="انتخاب نوع مالکیت" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ownershipTypes.map((opt) =>
                                            typeof opt === "string" ? (
                                                <SelectItem key={opt} value={opt}>
                                                    {opt}
                                                </SelectItem>
                                            ) : (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.ownership_type && (
                                    <p className="text-red-500 text-sm">{errors.ownership_type}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="founded_year">سال تأسیس</Label>
                                <Input
                                    id="founded_year"
                                    name="founded_year"
                                    type="number"
                                    value={formData.founded_year}
                                    onChange={handleInputChange}
                                    className={errors.founded_year ? "border-red-500" : ""}
                                />
                                {errors.founded_year && (
                                    <p className="text-red-500 text-sm">{errors.founded_year}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="employee_count">تعداد کارکنان</Label>
                                <Select
                                    value={formData.employee_count}
                                    onValueChange={(value) => handleSelectChange("employee_count", value)}
                                >
                                    <SelectTrigger id="employee_count">
                                        <SelectValue placeholder="انتخاب تعداد کارکنان" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employeeCounts.map((opt) =>
                                            typeof opt === "string" ? (
                                                <SelectItem key={opt} value={opt}>
                                                    {opt}
                                                </SelectItem>
                                            ) : (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.employee_count && (
                                    <p className="text-red-500 text-sm">{errors.employee_count}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">شماره تماس</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={errors.phone ? "border-red-500" : ""}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm">{errors.phone}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">آدرس</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className={errors.address ? "border-red-500" : ""}
                                />
                                {errors.address && (
                                    <p className="text-red-500 text-sm">{errors.address}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="website_address">آدرس وبسایت</Label>
                                <Input
                                    id="website_address"
                                    name="website_address"
                                    value={formData.website_address}
                                    onChange={handleInputChange}
                                    className={errors.website_address ? "border-red-500" : ""}
                                />
                                {errors.website_address && (
                                    <p className="text-red-500 text-sm">{errors.website_address}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="summary">خلاصه</Label>
                                <Input
                                    id="summary"
                                    name="summary"
                                    value={formData.summary}
                                    onChange={handleInputChange}
                                    className={errors.summary ? "border-red-500" : ""}
                                />
                                {errors.summary && (
                                    <p className="text-red-500 text-sm">{errors.summary}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">توضیحات</Label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className={`h-24 p-2 border rounded-md bg-transparent ${errors.description ? "border-red-500" : ""}`}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm">{errors.description}</p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                className="ml-2"
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingCompany(null);
                                }}
                            >
                                لغو
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && (
                                    <LuLoaderCircle className="animate-spin h-4 w-4 text-white dark:text-black" />
                                )}
                                {editingCompany ? "ویرایش" : "افزودن"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>حذف شرکت</DialogTitle>
                    </DialogHeader>
                    <p className="my-5">
                        آیا مطمئن هستید که می‌خواهید این شرکت را حذف کنید؟
                    </p>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="ml-2"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
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