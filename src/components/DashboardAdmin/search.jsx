import React, { useState } from "react";
import useAxios from "@/hooks/useAxios";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { LuLoaderCircle , LuSearch } from "react-icons/lu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Advanced search endpoints and their query params
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

const keyMappings = {
  "role": { 
    "full_admin": "مدیر عامل", 
    "admin": "ادمین", 
    "employer": "کارفرما", 
    "job_seeker": "کارجو" 
  },
  "employment_status": { 
    "employed": "شاغل", 
    "unemployed": "بیکار", 
    "student": "دانشجو", 
    "other": "سایر",
    "کارجو": "کارجو",
    "شاغل": "شاغل",
    "بیکار": "بیکار"
  },
  "is_visible": { 
    "true": "قابل نمایش", 
    "false": "خصوصی",
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

const Search = () => {
  const [activeTab, setActiveTab] = useState(ENDPOINTS[0].value);
  const [params, setParams] = useState({});
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const axiosInstance = useAxios();

  const selectedEndpoint = ENDPOINTS.find((ep) => ep.value === activeTab) || ENDPOINTS[0];

  const handleTabChange = (value) => {
    setActiveTab(value);
    setParams({});
    setResult([]);
  };

  const handleInputChange = (paramName, value) => {
    setParams((prev) => ({ ...prev, [paramName]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult([]);
    try {
      // Query string builder
      const qstr = Object.entries(params)
        .filter(([k, v]) => v && v.trim() !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");
      const url = selectedEndpoint.url + (qstr ? "?" + qstr : "");
      const res = await axiosInstance.get(url);
      // API may return list or paginated object
      const data =  Array.isArray(res.data) ? res.data : res.data.results ? res.data.results : [];
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

  return (
    <div className="container mx-auto py-6 px-4" dir="rtl">
      <Toaster className="dana" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 moraba">جستجوی پیشرفته</h1>
        <p className="text-muted-foreground">جستجو در تمامی داده‌های سیستم</p>
      </div>

      <Card className="mb-6">
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full"  dir="rtl">
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
                        : "" }
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
                        <Input
                          type="text"
                          value={params[p.name] || ""}
                          onChange={(e) => handleInputChange(p.name, e.target.value)}
                          placeholder={p.label}
                          className="w-full"
                        />
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
            />
          </CardContent>
        </Card>
      )}

      {!isLoading && result.length === 0 && Object.keys(params).some(k => params[k]) && (
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground flex items-center justify-center gap-x-3">
              <LuSearch className="text-lg opacity-70" />
              <p className="text-2xl">نتیجه‌ای یافت نشد</p>
              <p className="text-sm mt-2">لطفاً فیلترهای جستجو را تغییر دهید</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && result.length === 0 && !Object.keys(params).some(k => params[k]) && (
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground flex items-center justify-center gap-x-3">
            <LuSearch className="text-2xl opacity-70" />
              <p className="text-lg">برای شروع جستجو، فیلترهای مورد نظر را وارد کنید.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Search;
