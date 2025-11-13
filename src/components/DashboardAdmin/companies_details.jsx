import React, { useEffect, useState, useContext } from "react";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { LuLoaderCircle, LuCheck } from "react-icons/lu";
import useAxios from '@/hooks/useAxios';
import AuthContext from "@/context/authContext";

const companySchema = z.object({
  registration_number: z.string().min(1, "شماره ثبت الزامی است"),
  full_name: z.string().min(1, "نام شرکت الزامی است"),
  summary: z.string().min(1, "خلاصه الزامی است"),
  industry: z.enum(["کشاورزی", "فناوری اطلاعات", "سلامت", "تولید", "خدمات تجاری", "آموزش", "ساختمان", "خدمات مالی", "حمل و نقل", "سایر"]),
  ownership_type: z.enum(["خصوصی", "دولتی", "تعاونی", "سهامی عام", "سایر"]),
  website_address: z.string().min(4, "آدرس سایت الزامی است").url("آدرس سایت معتبر نیست"),
  founded_year: z.coerce.number().gte(1200, "سال تاسیس معتبر نیست").lte(new Date().getFullYear()+1, "سال تاسیس معتبر نیست"),
  employee_count: z.enum(["1-50", "51-200", "201-500", "501-1000", "1000+"]),
  address: z.string().min(1, "آدرس الزامی است"),
  phone: z.string().min(8, "شماره تلفن معتبر نیست"),
  description: z.string().min(1, "توضیحات الزامی است"),
  user_id: z.string().uuid("شناسه کاربر معتبر نیست"),
});

const INDUSTRY_OPTIONS = [
  "کشاورزی",
  "فناوری اطلاعات",
  "سلامت",
  "تولید",
  "خدمات تجاری",
  "آموزش",
  "ساختمان",
  "خدمات مالی",
  "حمل و نقل",
  "سایر"
];
const OWNERSHIP_OPTIONS = [
  "خصوصی",
  "دولتی",
  "تعاونی",
  "سهامی عام",
  "سایر"
];
const EMPLOYEE_OPTIONS = [
  "1-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+"
];

const EMPTY_FORM = {
  registration_number: "",
  full_name: "",
  summary: "",
  industry: "کشاورزی",
  ownership_type: "خصوصی",
  website_address: "",
  founded_year: "",
  employee_count: "1-50",
  address: "",
  phone: "",
  description: "",
  user_id: "",
};

export default function CompaniesDetails() {
  const { user } = useContext(AuthContext);
  const [company, setCompany] = useState(null);
  const [loadingGet, setLoadingGet] = useState(true);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  const axiosInstance = useAxios();

  const fetchCompany = async () => {
    setLoadingGet(true);
    try {
      const res = await axiosInstance.get("/employer_companies/?offset=0&limit=100");
      const userCompany = (res.data || []).find(
        (c) => c.user && user && c.user.id === user.user_id
      );
      setCompany(userCompany || null);
    } catch (e) {
      toast.error("خطا در دریافت شرکت");
    } finally {
      setLoadingGet(false);
    }
  };

  useEffect(() => {
    if(user?.user_id){
      fetchCompany();
    }
    // eslint-disable-next-line
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) =>
    setFormData(prev => ({ ...prev, [name]: value }));

  const handleEditClick = () => {
    if(company) {
      setFormData({
        ...company,
        founded_year: company.founded_year ? company.founded_year : "",
        user_id: user.user_id
      });
    } else {
      setFormData({ ...EMPTY_FORM, user_id: user.user_id });
    }
    setErrors({});
    setIsEditModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const validated = companySchema.parse(formData);
      setErrors({});
      if(company) {
        // update
        await axiosInstance.patch(`/employer_companies/${company.id}`, validated);
        toast.success("اطلاعات شرکت با موفقیت ویرایش شد");
      } else {
        // create
        await axiosInstance.post(`/employer_companies`, validated);
        toast.success("شرکت جدید ثبت شد");
      }
      setIsEditModalOpen(false);
      fetchCompany();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast.error("خطا در ذخیره اطلاعات شرکت");
      }
    }
    setSubmitLoading(false);
  };

  return (
    <div className="p-4 lg:p-8 max-w-xl mx-auto" dir="rtl">
      <Toaster className="dana" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold moraba">اطلاعات شرکت شما</h1>
        <Button variant="secondary" onClick={handleEditClick}>
          {company ? "ویرایش" : "ثبت اطلاعات"}
        </Button>
      </div>
      {loadingGet ? (
        <div className="flex justify-center pt-20">
          <LuLoaderCircle className="animate-spin h-10 w-10 text-black dark:text-white" />
        </div>
      ) : (
        <div
          className="rounded-2xl shadow-lg bg-white dark:bg-zinc-900 p-8 border border-zinc-100 dark:border-zinc-800 transition"
        >
          {company ? (
            <div className="space-y-6">
              <ItemRow label="نام شرکت" value={company.full_name} />
              <ItemRow label="شماره ثبت" value={company.registration_number} />
              <ItemRow label="فعالیت(صنعت)" value={company.industry} />
              <ItemRow label="نوع مالکیت" value={company.ownership_type} />
              <ItemRow label="وبسایت" value={
                <a href={company.website_address} target="_blank" rel="noreferrer" className="text-blue-600 underline break-all">{company.website_address}</a>
              } />
              <ItemRow label="سال تاسیس" value={company.founded_year} />
              <ItemRow label="تعداد کارمندان" value={company.employee_count} />
              <ItemRow label="آدرس" value={company.address} />
              <ItemRow label="تلفن" value={company.phone} />
              <ItemRow label="خلاصه" value={company.summary} />
              <ItemRow label="توضیحات" value={company.description} className="" />
            </div>
          ) : (
            <div className="text-gray-500 text-center py-12">هنوز اطلاعات شرکتی ثبت نکرده‌اید.</div>
          )}
        </div>
      )}

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]"  dir="rtl">
          <DialogHeader>
            <DialogTitle>{company ? "ویرایش شرکت" : "ثبت شرکت"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 gap-6 mt-4">
            <FormGroup
              label="نام شرکت"
              id="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              error={errors.full_name}
            />
            <FormGroup
              label="شماره ثبت"
              id="registration_number"
              value={formData.registration_number}
              onChange={handleInputChange}
              error={errors.registration_number}
            />
            <FormGroup
              label="خلاصه"
              id="summary"
              value={formData.summary}
              onChange={handleInputChange}
              error={errors.summary}
            />
            <FormSelect
              label="فعالیت (صنعت)"
              id="industry"
              value={formData.industry}
              options={INDUSTRY_OPTIONS}
              onChange={val => handleSelectChange("industry", val)}
              error={errors.industry}
            />
            <FormSelect
              label="نوع مالکیت"
              id="ownership_type"
              value={formData.ownership_type}
              options={OWNERSHIP_OPTIONS}
              onChange={val => handleSelectChange("ownership_type", val)}
              error={errors.ownership_type}
            />
            <FormGroup
              label="آدرس وبسایت"
              id="website_address"
              value={formData.website_address}
              onChange={handleInputChange}
              error={errors.website_address}
            />
            <FormGroup
              label="سال تاسیس"
              id="founded_year"
              value={formData.founded_year}
              onChange={handleInputChange}
              type="number"
              error={errors.founded_year}
            />
            <FormSelect
              label="تعداد کارمندان"
              id="employee_count"
              value={formData.employee_count}
              options={EMPLOYEE_OPTIONS}
              onChange={val => handleSelectChange("employee_count", val)}
              error={errors.employee_count}
            />
            <FormGroup
              label="آدرس"
              id="address"
              value={formData.address}
              onChange={handleInputChange}
              error={errors.address}
            />
            <FormGroup
              label="تلفن"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
            />
            <FormGroup
              label="توضیحات"
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              as="textarea"
              error={errors.description}
            />
            <DialogFooter>
              <Button
                variant="outline"
                className="ml-2"
                type="button"
                onClick={() => setIsEditModalOpen(false)}
              >
                لغو
              </Button>
              <Button type="submit" disabled={submitLoading}>
                {submitLoading && (
                  <LuLoaderCircle className="animate-spin h-4 w-4 mx-1" />
                )}
                ثبت
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ItemRow({ label, value }) {
  return (
    <div className="flex border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
      <dt className="w-32 text-gray-500 shrink-0 font-medium">{label}:</dt>
      <dd className="font-semibold text-zinc-800 dark:text-zinc-50 break-words truncate max-w-[280px] whitespace-normal">
        {value || <span className="text-gray-400">—</span>}
      </dd>
    </div>
  );
}

function FormGroup({ label, id, value, onChange, error, type = "text", as }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {as === "textarea" ? (
        <Input
          as="textarea"
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          rows={3}
          className={error ? "border-red-500 mt-1" : "mt-1"}
          style={{resize:'vertical'}}
        />
      ) : (
        <Input
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          type={type}
          className={error ? "border-red-500 mt-1" : "mt-1"}
        />
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function FormSelect({ label, id, value, options, onChange, error }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={val => onChange(val)}>
        <SelectTrigger id={id} className={error ? "border-red-500 mt-1" : "mt-1"}>
          <SelectValue placeholder={`انتخاب ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => (
            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}