import React, { useState } from "react";
import useAxios from "@/hooks/useAxios";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LuLoaderCircle, LuSearch, LuTrash2 } from "react-icons/lu";
import { FaRegEdit } from "react-icons/fa";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { DataTable } from "@/components/data-table";

// Select options for specific fields
const SELECT_OPTIONS = {
  "role": [
    { value: "full_admin", label: "مدیر عامل" },
    { value: "admin", label: "ادمین" },
    { value: "employer", label: "کارفرما" },
    { value: "job_seeker", label: "کارجو" },
  ],
  "employment_status": [
    { value: "employed", label: "شاغل" },
    { value: "unemployed", label: "بیکار" },
    { value: "student", label: "دانشجو" },
    { value: "other", label: "سایر" },
  ],
  "marital_status": [
    { value: "مجرد", label: "مجرد" },
    { value: "متاهل", label: "متاهل" },
  ],
  "gender": [
    { value: "مرد", label: "مرد" },
    { value: "زن", label: "زن" },
  ],
  "degree": [
    { value: "دبستان", label: "دبستان" },
    { value: "دیپلم", label: "دیپلم" },
    { value: "کاردانی", label: "کاردانی" },
    { value: "کارشناسی", label: "کارشناسی" },
    { value: "کارشناسی ارشد", label: "کارشناسی ارشد" },
    { value: "دکتری", label: "دکتری" },
    { value: "سایر", label: "سایر" },
  ],
  "proficiency_level": [
    { value: "مبتدی", label: "مبتدی" },
    { value: "متوسط", label: "متوسط" },
    { value: "پیشرفته", label: "پیشرفته" }
  ],
  "has_certificate": [
    { value: "true", label: "بله" },
    { value: "false", label: "خیر" }
  ],
  "is_visible": [
    { value: "true", label: "قابل نمایش" },
    { value: "false", label: "خصوصی" }
  ],
  "status": [
    { value: "ارسال شده", label: "ارسال شده" },
    { value: "در حال بررسی", label: "در حال بررسی" },
    { value: "رد شده", label: "رد شده" },
    { value: "پذیرفته شده", label: "پذیرفته شده" }
  ]
};

const CITY_OPTIONS = [
  { value: "تهران", label: "تهران" },
  { value: "مشهد", label: "مشهد" },
  { value: "اصفهان", label: "اصفهان" },
  { value: "شیراز", label: "شیراز" },
  { value: "تبریز", label: "تبریز" },
  { value: "کرج", label: "کرج" },
  { value: "سایر", label: "سایر" },
];


// Helper: return select options for the param field name, otherwise null
function getSelectOptions(paramName) {
  if (paramName === "city") return CITY_OPTIONS;
  return SELECT_OPTIONS[paramName] || null;
}

// --- Data Table columns injection helpers ---
function getTableActions({ onEdit, onDelete }) {
  return {
    id: "actions",
    label: "عملیات",
    render: (row) => (
      <div className="flex gap-2 justify-center">
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-zinc-200"
          onClick={() => onEdit(row)}
        >
          <FaRegEdit className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-red-100 text-red-500"
          onClick={() => onDelete(row)}
        >
          <LuTrash2 className="w-5 h-5" />
        </Button>
      </div>
    ),
  };
}

// ---- Edit Modal -----
function EditModal({ open, onOpenChange, fields, record, onSubmit, loading }) {
  const [form, setForm] = useState(record || {});

  React.useEffect(() => {
    setForm(record || {});
  }, [record]);

  // Handle for both text and select
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ویرایش رکورد</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit(form);
          }}
          className="space-y-4"
        >
          {fields.map((field) => (
            <div key={field.key || field.name} className="space-y-2">
              <label className="text-sm font-medium block">{field.label}</label>
              {(() => {
                const selectOptions = getSelectOptions(field.key || field.name);

                if (selectOptions) {
                  return (
                    <Select
                      value={form[field.key || field.name] === undefined || form[field.key || field.name] === null
                        ? ""
                        : String(form[field.key || field.name])}
                      onValueChange={value => {
                        handleChange(field.key || field.name, value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        {(() => {
                          const selected = selectOptions.find(opt => String(opt.value) === String(form[field.key || field.name]));
                          return selected ? selected.label : "انتخاب کنید";
                        })()}
                      </SelectTrigger>
                      <SelectContent className="rtl">
                        {selectOptions.map(opt => (
                          <SelectItem key={opt.value} value={String(opt.value)}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                } else {
                  return (
                    <Input
                      type="text"
                      value={form[field.key || field.name] || ""}
                      onChange={e => handleChange(field.key || field.name, e.target.value)}
                      className="w-full"
                    />
                  );
                }
              })}
            </div>
          ))}
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary"
            >
              {loading ? <LuLoaderCircle className="animate-spin mr-2 w-4 h-4" /> : null}
              ذخیره تغییرات
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---- Main Search Component ----
const keyMappings = {
  "role": {
    "full_admin": "مدیر عامل",
    "admin": "ادمین",
    "employer": "کارفرما",
    "job_seeker": "کارجو"
  },
  "employment_status": {
    "دانشجو": "دانشجو",
    "سایر": "سایر",
    "کارجو": "کارجو",
    "شاغل": "شاغل",
    "بیکار": "بیکار"
  },
  "is_visible": {
    "true": "قابل نمایش",
    "false": "خصوصی"
  },
  "marital_status": {
    "مجرد": "مجرد",
    "متاهل": "متاهل"
  },
  "gender": {
    "مرد": "مرد",
    "زن": "زن"
  },
  "degree": {
    "دبستان": "دبستان",
    "دیپلم": "دیپلم",
    "کاردانی": "کاردانی",
    "کارشناسی": "کارشناسی",
    "کارشناسی ارشد": "کارشناسی ارشد",
    "دکتری": "دکتری",
    "سایر": "سایر"
  },
  "proficiency_level": {
    "مبتدی": "مبتدی",
    "متوسط": "متوسط",
    "پیشرفته": "پیشرفته"
  },
  "has_certificate": {
    "true": "بله",
    "false": "خیر"
  },
  "certificate_verification_status": {
    "تایید شده": "تایید شده",
    "رد شده": "رد شده",
    "در انتظار تایید": "در انتظار تایید"
  },
  "status": {
    "ارسال شده": "ارسال شده",
    "در حال بررسی": "در حال بررسی",
    "رد شده": "رد شده",
    "پذیرفته شده": "پذیرفته شده"
  }
};

const ENDPOINTS = [
  {
    label: "کاربران",
    value: "users",
    url: "/users/",
    params: [
      { name: "full_name", label: "نام کامل" },
      { name: "email", label: "ایمیل" },
      { name: "phone", label: "شماره تلفن" },
      { name: "role", label: "نقش" },
      { name: "username", label: "نام کاربری" },
    ],
    headers: [
      { key: "full_name", label: "نام کامل" },
      { key: "email", label: "ایمیل" },
      { key: "phone", label: "شماره تلفن" },
      { key: "role", label: "نقش" },
      { key: "username", label: "نام کاربری" },
      // actions
    ],
  },
  {
    label: "رزومه‌ها",
    value: "resumes",
    url: "/job_seeker_resumes/",
    params: [
      { name: "job_title", label: "عنوان شغلی" },
      { name: "employment_status", label: "وضعیت استخدام" },
      { name: "is_visible", label: "قابل نمایش/خصوصی" },
    ],
    headers: [
      { key: "job_title", label: "عنوان شغلی" },
      { key: "employment_status", label: "وضعیت استخدام" },
      { key: "is_visible", label: "وضعیت نمایش" },
      { key: "id", label: "شناسه" },
    ],
  },
  {
    label: "اطلاعات شخصی کارجویان",
    value: "personal-informations",
    url: "/job_seeker_personal_informations/",
    params: [
      { name: "residence_province", label: "استان" },
      { name: "residence_address", label: "آدرس" },
      { name: "marital_status", label: "وضعیت تاهل" },
      { name: "gender", label: "جنسیت" },
    ],
    headers: [
      { key: "residence_province", label: "استان" },
      { key: "residence_address", label: "آدرس" },
      { key: "marital_status", label: "وضعیت تاهل" },
      { key: "gender", label: "جنسیت" },
      { key: "birth_year", label: "سال تولد" },
      { key: "id", label: "شناسه" },
    ],
  },
  {
    label: "تحصیلات کارجویان",
    value: "education",
    url: "/job_seeker_educations/",
    params: [
      { name: "institution_name", label: "نام موسسه" },
      { name: "degree", label: "مدرک" },
      { name: "study_field", label: "رشته تحصیلی" },
    ],
    headers: [
      { key: "institution_name", label: "نام موسسه" },
      { key: "degree", label: "مدرک" },
      { key: "study_field", label: "رشته تحصیلی" },
      { key: "start_date", label: "تاریخ شروع" },
      { key: "end_date", label: "تاریخ پایان" },
      { key: "id", label: "شناسه" },
    ],
  },
  {
    label: "مهارت‌های کارجویان",
    value: "skills",
    url: "/job_seeker_skills/",
    params: [
      { name: "title", label: "عنوان مهارت" },
      { name: "proficiency_level", label: "سطح مهارت" },
      { name: "has_certificate", label: "دارای گواهی" },
    ],
    headers: [
      { key: "title", label: "عنوان مهارت" },
      { key: "proficiency_level", label: "سطح مهارت" },
      { key: "has_certificate", label: "دارای گواهی" },
      { key: "certificate_verification_status", label: "وضعیت تایید گواهی" },
      { key: "id", label: "شناسه" },
    ],
  },
  {
    label: "سوابق شغلی کارجویان",
    value: "work-experiences",
    url: "/job_seeker_work_experiences/",
    params: [
      { name: "title", label: "عنوان شغل" },
      { name: "company_name", label: "نام شرکت" },
    ],
    headers: [
      { key: "title", label: "عنوان شغل" },
      { key: "company_name", label: "نام شرکت" },
      { key: "start_date", label: "تاریخ شروع" },
      { key: "end_date", label: "تاریخ پایان" },
      { key: "id", label: "شناسه" },
    ],
  },
  {
    label: "شرکت‌ها",
    value: "companies",
    url: "/companies/",
    params: [
      { name: "name", label: "نام شرکت" },
      { name: "email", label: "ایمیل" },
      { name: "address", label: "آدرس" },
    ],
    headers: [
      { key: "name", label: "نام شرکت" },
      { key: "email", label: "ایمیل" },
      { key: "address", label: "آدرس" },
      { key: "id", label: "شناسه" },
    ],
  },
  {
    label: "درخواست‌های شغلی",
    value: "job-applications",
    url: "/job_applications/",
    params: [
      { name: "status", label: "وضعیت" },
      { name: "application_date", label: "تاریخ درخواست" },
    ],
    headers: [
      { key: "status", label: "وضعیت" },
      { key: "application_date", label: "تاریخ درخواست" },
      { key: "id", label: "شناسه" },
    ],
  },
  {
    label: "آگهی‌های شغلی",
    value: "job-postings",
    url: "/job_postings/",
    params: [
      { name: "title", label: "عنوان" },
      { name: "status", label: "وضعیت" },
      { name: "city", label: "شهر" },
    ],
    headers: [
      { key: "title", label: "عنوان" },
      { key: "status", label: "وضعیت" },
      { key: "city", label: "شهر" },
      { key: "id", label: "شناسه" },
    ],
  },
];

const Search = () => {
  const [activeTab, setActiveTab] = useState(ENDPOINTS[0].value);
  const [params, setParams] = useState({});
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editRec, setEditRec] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const axiosInstance = useAxios();

  const selectedEndpoint = ENDPOINTS.find((ep) => ep.value === activeTab) || ENDPOINTS[0];

  const handleTabChange = (value) => {
    setActiveTab(value);
    setParams({});
    setResult([]);
    setEditRec(null);
    setEditModalOpen(false);
  };

  const handleInputChange = (paramName, value) => {
    setParams((prev) => ({ ...prev, [paramName]: value }));
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult([]);
    try {
      const qstr = Object.entries(params)
        .filter(([k, v]) => v && String(v).trim() !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");
      const url = selectedEndpoint.url + (qstr ? "search/?" + qstr : "");
      console.log(url);
      
      const res = await axiosInstance.get(url);
      const data = Array.isArray(res.data) ? res.data : res.data.results ? res.data.results : [];
      setResult(data);
      if (!data.length) {
        toast("موردی یافت نشد", { icon: "🔍" });
      } else {
        toast.success(`${data.length} نتیجه یافت شد`);
      }
    } catch (err) {
      console.error("Search error:", err);
      toast.error("خطا در جستجو");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Delete logic ---
  const handleDelete = async (row) => {
    if (!window.confirm("آیا از حذف این مورد مطمئن هستید؟")) return;
    try {
      await axiosInstance.delete(`${selectedEndpoint.url}${row || ""}/`);
      setResult((prev) => prev.filter((r) => (r.id || r.pk) !== row));
      toast.success("با موفقیت حذف شد");
    } catch (err) {
      toast.error("خطا در حذف رکورد");
      console.error(err);
    }
  };

  // --- Edit logic ---
  const handleEdit = (row) => {
    setEditRec(row);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => {
    setEditRec(null);
    setEditModalOpen(false);
  };

  const handleEditSubmit = async (data) => {
    setEditLoading(true);
    let id = editRec.id || editRec.pk;
    try {
      const res = await axiosInstance.patch(`${selectedEndpoint.url}${id}/`, data);
      // update result
      setResult(prev =>
        prev.map((r) =>
          (r.id || r.pk) === id ? { ...r, ...res.data } : r
        )
      );
      toast.success("تغییرات با موفقیت ذخیره شد");
      setEditModalOpen(false);
      setEditRec(null);
    } catch (err) {
      toast.error("خطا در ویرایش رکورد");
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };

  // Select: use Select for params with defined options, else text input
  function renderParamInput(param) {
    const selectOptions = getSelectOptions(param.name);
    
    if (selectOptions != null) {
      return (
        <Select
          value={
            params[param.name] !== undefined
              ? String(params[param.name])
              : ""
          }
          onValueChange={(value) => handleInputChange(param.name, value)}
        >
          <SelectTrigger className="w-full">
            {
              (() => {
                const selected = selectOptions.find(opt => String(opt.value) === String(params[param.name]));
                return selected ? selected.label : "انتخاب کنید";
              })()
            }
          </SelectTrigger>
          <SelectContent className="rtl">
            {selectOptions.map(opt => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else {
      return (
        <Input
          type="text"
          value={params[param.name] || ""}
          onChange={(e) => handleInputChange(param.name, e.target.value)}
          placeholder={param.label}
          className="w-full"
        />
      );
    }
  }



  return (
    <div className="container mx-auto py-6 px-4" dir="rtl">
      <Toaster className="dana" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 moraba">جستجوی پیشرفته</h1>
        <p className="text-muted-foreground">جستجو در تمامی داده‌های سیستم</p>
      </div>

      <Card className="mb-6">
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full" dir="rtl">
            <div className="w-full overflow-x-auto scrollbar" style={{ WebkitOverflowScrolling: "touch" }}>
              <TabsList
                className="
                  flex w-fit min-w-full gap-2 h-auto p-1 mt-6
                  overflow-x-visible
                  !overflow-y-visible
                "
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {ENDPOINTS.map((ep) => (
                  <TabsTrigger
                    key={ep.value}
                    value={ep.value}
                    className={`
                      text-xs md:text-sm whitespace-nowrap px-4 py-2 flex-shrink-0
                      max-w-[200px] sm:max-w-[160px] md:max-w-[200px] overflow-hidden text-ellipsis
                      transition
                      ${activeTab === ep.value
                        ? "!bg-zinc-400 !text-gray-900"
                        : ""}
                    `}
                  >
                    {ep.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <style>
                {`
                  .scrollbar::-webkit-scrollbar { display: none; }
                  @media (max-width: 640px) {
                    .min-w-full { min-width: 100vw !important; }
                    .w-fit { width: fit-content !important; }
                  }
                `}
              </style>
            </div>

            {ENDPOINTS.map((ep) => (
              <TabsContent key={ep.value} value={ep.value} className="mt-6">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ep.params.map((p) => (
                      <div key={p.name} className="space-y-2">
                        <label className="text-sm font-medium block">{p.label}</label>
                        {renderParamInput(p)}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="min-w-[120px]"
                    >
                      {isLoading ? (
                        <>
                          <LuLoaderCircle className="animate-spin h-4 w-4 ml-2" />
                          در حال جستجو...
                        </>
                      ) : (
                        "جستجو"
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {editRec && (
        <EditModal
          open={editModalOpen}
          onOpenChange={handleEditModalClose}
          fields={selectedEndpoint.headers.filter(h => h.key !== "id" && h.key !== "actions")}
          record={editRec}
          onSubmit={handleEditSubmit}
          loading={editLoading}
        />
      )}

      {result.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>نتایج جستجو ({result.length} مورد)</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              headers={selectedEndpoint.headers}
              data={result}
              valueMappings={keyMappings}
              onDelete={handleDelete}
            // onEdit={handleEdit}
            />
          </CardContent>
        </Card>
      )}

      {!isLoading && result.length === 0 && Object.keys(params).some((k) => params[k]) && (
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground flex items-center justify-center flex-col gap-x-3">
              <div className="flex items-center justify-center gap-2">
                <LuSearch className="text-lg opacity-70" />
                <p className="text-lg">نتیجه‌ای یافت نشد</p>
              </div>
              <p className="text-sm mt-2">لطفاً فیلترهای جستجو را تغییر دهید</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && result.length === 0 && !Object.keys(params).some((k) => params[k]) && (
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground flex items-center justify-center gap-x-3">
              <LuSearch className="text-2xl opacity-70" />
              <p className="text-sm">برای شروع جستجو، فیلترهای مورد نظر را وارد کنید.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Search;
