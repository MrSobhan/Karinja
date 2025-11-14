import React, { useEffect, useState, useContext } from "react";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAxios from "@/hooks/useAxios";
import AuthContext from "@/context/authContext";
import { LuLoaderCircle, LuPencil, LuShieldX } from "react-icons/lu";
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PersianCalendar from "@/lib/PersianCalendar";

const resumeSchema = z.object({
  job_title: z.string().min(2, "عنوان شغلی الزامی است"),
  professional_summary: z.string().min(2, "خلاصه الزامی است"),
  employment_status: z.string().min(2, "وضعیت الزامی است"),
  is_visible: z.boolean(),
  user_id: z.string().uuid(),
});

const personalInfoSchema = z.object({
  residence_province: z.string(),
  residence_address: z.string(),
  marital_status: z.string(),
  birth_year: z.coerce.number(),
  gender: z.string(),
  military_service_status: z.string(),
});

const educationSchema = z.object({
  institution_name: z.string(),
  degree: z.string(),
  study_field: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  description: z.string(),
});

const skillSchema = z.object({
  title: z.string(),
  proficiency_level: z.string(),
  has_certificate: z.boolean(),
  certificate_issuing_organization: z.string(),
  certificate_code: z.string(),
  certificate_verification_status: z.string(),
});

const workSchema = z.object({
  title: z.string(),
  company_name: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  description: z.string(),
});

export default function MyResumes() {
  const { user } = useContext(AuthContext);
  const axiosInstance = useAxios();

  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState({});
  const [newResume, setNewResume] = useState({
    job_title: "",
    professional_summary: "",
    employment_status: "کارجو",
    is_visible: true,
    residence_province: "",
    residence_address: "",
    marital_status: "",
    birth_year: "",
    gender: "",
    military_service_status: "",
    educations: [
      {
        institution_name: "",
        degree: "",
        study_field: "",
        start_date: "",
        end_date: "",
        description: "",
      },
    ],
    skills: [
      {
        title: "",
        proficiency_level: "",
        has_certificate: false,
        certificate_issuing_organization: "",
        certificate_code: "",
        certificate_verification_status: "",
      },
    ],
    work_experiences: [
      {
        title: "",
        company_name: "",
        start_date: "",
        end_date: "",
        description: "",
      },
    ],
  });

  const [addStep, setAddStep] = useState(0);

  useEffect(() => {
    if (user?.user_id) fetchResumes();
    // eslint-disable-next-line
  }, [user]);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/job_seeker_resumes/?user_id=${user.user_id}`);
      setResumes(res.data || []);
    } catch {
      toast.error("خطا در دریافت رزومه‌ها");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setAddStep(st => st + 1);
  const prevStep = () => setAddStep(st => (st > 0 ? st - 1 : 0));

  // Main fields:
  const handleField = (f, v) => setNewResume(r => ({ ...r, [f]: v }));

  // Dynamic lists
  const handleArrField = (section, idx, field, value) => {
    setNewResume(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Add/remove for education, skills, work
  const addListItem = (section, template) => {
    setNewResume(prev => ({
      ...prev,
      [section]: [...prev[section], { ...template }],
    }));
  };

  const removeListItem = (section, idx) => {
    setNewResume(prev => ({
      ...prev,
      [section]: prev[section].length > 1
        ? prev[section].filter((_, i) => i !== idx)
        : prev[section],
    }));
  };

  // ---------- Add Resume ----------
  const handleAddResume = async e => {
    e.preventDefault();
    setSubmitLoading(prev => ({ ...prev, add: true }));
    try {
      const resumeBase = resumeSchema.parse({
        job_title: newResume.job_title,
        professional_summary: newResume.professional_summary,
        employment_status: newResume.employment_status,
        is_visible: !!newResume.is_visible,
        user_id: user.user_id,
      });
      const res = await axiosInstance.post("/job_seeker_resumes", resumeBase);
      const resumeId = res.data.id;
      const personalInfo = personalInfoSchema.parse({
        residence_province: newResume.residence_province,
        residence_address: newResume.residence_address,
        marital_status: newResume.marital_status,
        birth_year: newResume.birth_year,
        gender: newResume.gender,
        military_service_status: newResume.military_service_status,
      });
      await axiosInstance.post("/job_seeker_personal_informations", {
        ...personalInfo,
        job_seeker_resume_id: resumeId,
      });
      for (let edu of newResume.educations) {
        const education = educationSchema.parse(edu);
        await axiosInstance.post("/job_seeker_educations", {
          ...education,
          job_seeker_resume_id: resumeId,
        });
      }
      for (let skill of newResume.skills) {
        const skillData = skillSchema.parse(skill);
        await axiosInstance.post("/job_seeker_skills", {
          ...skillData,
          job_seeker_resume_id: resumeId,
        });
      }
      for (let wrk of newResume.work_experiences) {
        const work = workSchema.parse(wrk);
        await axiosInstance.post("/job_seeker_work_experiences", {
          ...work,
          job_seeker_resume_id: resumeId,
        });
      }
      toast.success("رزومه حرفه‌ای با موفقیت ثبت شد.");
      setAddMode(false);
      setAddStep(0);
      setNewResume({
        job_title: "",
        professional_summary: "",
        employment_status: "کارجو",
        is_visible: true,
        residence_province: "",
        residence_address: "",
        marital_status: "",
        birth_year: "",
        gender: "",
        military_service_status: "",
        educations: [{ institution_name: "", degree: "", study_field: "", start_date: "", end_date: "", description: "" }],
        skills: [{ title: "", proficiency_level: "", has_certificate: false, certificate_issuing_organization: "", certificate_code: "", certificate_verification_status: "" }],
        work_experiences: [{ title: "", company_name: "", start_date: "", end_date: "", description: "" }],
      });
      fetchResumes();
    } catch (e) {
      if (e instanceof z.ZodError) {
        toast.error(e.errors.map(err => err.message).join(" , "));
      } else {

        toast.error("خطا در ثبت رزومه حرفه‌ای: " + (e?.response?.data?.detail || e.message));
      }
    }
    setSubmitLoading(prev => ({ ...prev, add: false }));
  };

  // ---------- Edit Resume ----------
  // Helper: Flat resume data structures
  function flattenResumeForEdit(resume) {
    // Compose updatable fields, and fill as much as possible
    const info = resume.job_seeker_personal_information || {};
    const educations = resume.job_seeker_educations || [
      { institution_name: "", degree: "", study_field: "", start_date: "", end_date: "", description: "" },
    ];
    const skills = resume.job_seeker_skills || [
      { title: "", proficiency_level: "", has_certificate: false, certificate_issuing_organization: "", certificate_code: "", certificate_verification_status: "" },
    ];
    const works = resume.job_seeker_work_experiences || [
      { title: "", company_name: "", start_date: "", end_date: "", description: "" },
    ];
    return {
      job_title: resume.job_title || "",
      professional_summary: resume.professional_summary || "",
      employment_status: resume.employment_status || "کارجو",
      is_visible: resume.is_visible ?? true,
      residence_province: info.residence_province || "",
      residence_address: info.residence_address || "",
      marital_status: info.marital_status || "",
      birth_year: info.birth_year || "",
      gender: info.gender || "",
      military_service_status: info.military_service_status || "",
      educations: educations.length > 0 ? [...educations] : [{ institution_name: "", degree: "", study_field: "", start_date: "", end_date: "", description: "" }],
      skills: skills.length > 0 ? [...skills] : [{ title: "", proficiency_level: "", has_certificate: false, certificate_issuing_organization: "", certificate_code: "", certificate_verification_status: "" }],
      work_experiences: works.length > 0 ? [...works] : [{ title: "", company_name: "", start_date: "", end_date: "", description: "" }],
    };
  }

  const handleEditResume = async e => {
    e.preventDefault();
    setSubmitLoading(prev => ({ ...prev, edit: true }));
    try {
      // Update resume base
      const resumeBase = resumeSchema.parse({
        job_title: newResume.job_title,
        professional_summary: newResume.professional_summary,
        employment_status: newResume.employment_status,
        is_visible: !!newResume.is_visible,
        user_id: user.user_id,
      });
      await axiosInstance.patch(`/job_seeker_resumes/${editId}/`, resumeBase);

      // Update personal information
      if (editId) {
        // Fetch related personal info ID
        let infoId = null;
        const editResumeObj = resumes.find(r => r.id === editId);
        if (editResumeObj?.job_seeker_personal_information?.id) {
          infoId = editResumeObj.job_seeker_personal_information.id;
        } else {
          // It shouldn't happen, but avoid crash
          toast.error("خطا در بروزرسانی اطلاعات فردی (مشخصه رکورد موجود نیست)");
        }
        const personalInfo = personalInfoSchema.parse({
          residence_province: newResume.residence_province,
          residence_address: newResume.residence_address,
          marital_status: newResume.marital_status,
          birth_year: newResume.birth_year,
          gender: newResume.gender,
          military_service_status: newResume.military_service_status,
        });
        if (infoId) {
          await axiosInstance.patch(`/job_seeker_personal_informations/${infoId}/`, personalInfo);
        }
      }

      // Remove all educations, skills, works related, then add again
      // (More robust would be granular editing, but for FE simplicity, we "replace all" - if backend allows)
      if (editId) {
        // Delete all prev
        const resumeObj = resumes.find(r => r.id === editId);
        // Educations
        for (const ed of resumeObj?.job_seeker_educations || []) {
          await axiosInstance.delete(`/job_seeker_educations/${ed.id}/`);
        }
        for (const skill of resumeObj?.job_seeker_skills || []) {
          await axiosInstance.delete(`/job_seeker_skills/${skill.id}/`);
        }
        for (const w of resumeObj?.job_seeker_work_experiences || []) {
          await axiosInstance.delete(`/job_seeker_work_experiences/${w.id}/`);
        }

        // Re-add as new
        for (let edu of newResume.educations) {
          const education = educationSchema.parse(edu);
          await axiosInstance.post("/job_seeker_educations", {
            ...education,
            job_seeker_resume_id: editId,
          });
        }
        for (let skill of newResume.skills) {
          const skillData = skillSchema.parse(skill);
          await axiosInstance.post("/job_seeker_skills", {
            ...skillData,
            job_seeker_resume_id: editId,
          });
        }
        for (let wrk of newResume.work_experiences) {
          const work = workSchema.parse(wrk);
          await axiosInstance.post("/job_seeker_work_experiences", {
            ...work,
            job_seeker_resume_id: editId,
          });
        }
      }

      toast.success("رزومه با موفقیت ویرایش شد.");
      setEditMode(false);
      setAddStep(0);
      setEditId(null);
      setNewResume({
        job_title: "",
        professional_summary: "",
        employment_status: "کارجو",
        is_visible: true,
        residence_province: "",
        residence_address: "",
        marital_status: "",
        birth_year: "",
        gender: "",
        military_service_status: "",
        educations: [{ institution_name: "", degree: "", study_field: "", start_date: "", end_date: "", description: "" }],
        skills: [{ title: "", proficiency_level: "", has_certificate: false, certificate_issuing_organization: "", certificate_code: "", certificate_verification_status: "" }],
        work_experiences: [{ title: "", company_name: "", start_date: "", end_date: "", description: "" }],
      });
      fetchResumes();
    } catch (e) {
      if (e instanceof z.ZodError) {
        toast.error(e.errors.map(err => err.message).join(" , "));
      } else {

        console.log(e.data);
        toast.error("خطا در ویرایش رزومه: " + (e?.response?.data?.detail || e.message));
      }
    }
    setSubmitLoading(prev => ({ ...prev, edit: false }));
  };

  // ---------- Delete Resume ----------
  const handleDeleteResume = async (id) => {
    try {
      setSubmitLoading(prev => ({ ...prev, [`del_${id}`]: true }));
      await axiosInstance.delete(`/job_seeker_resumes/${id}/`);
      toast.success("رزومه با موفقیت حذف شد.");

      fetchResumes();
    } catch (e) {
      toast.error("خطا در حذف رزومه: " + (e?.response?.data?.detail || e.message));
    } finally {
      setSubmitLoading(prev => ({ ...prev, [`del_${id}`]: false }));
    }
  };

  const steps = [
    {
      label: "رزومه",
      content: (
        <div className="grid grid-cols-1 gap-6">
          <FormGroup
            label="عنوان شغلی"
            id="job_title"
            value={newResume.job_title}
            onChange={e => handleField("job_title", e.target.value)}
          />
          <FormGroup
            label="خلاصه شغلی"
            id="professional_summary"
            value={newResume.professional_summary}
            onChange={e => handleField("professional_summary", e.target.value)}
          />
          <div>
            <Label htmlFor="employment_status" className="text-zinc-800 dark:text-zinc-200">وضعیت اشتغال</Label>
            <Select
              value={newResume.employment_status}
              onValueChange={value => handleField("employment_status", value)}
            >
              <SelectTrigger id="employment_status" className={false ? "border-red-500 mt-1 w-full" : "mt-1 w-full"} >
                <SelectValue placeholder={`انتخاب ${newResume.employment_status}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="کارجو">کارجو</SelectItem>
                <SelectItem value="به دنبال شغل بهتر">به دنبال شغل بهتر</SelectItem>
                <SelectItem value="شاغل">شاغل</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center">
            <Label htmlFor="is_visible" className="text-zinc-800 dark:text-zinc-200 ml-3">قابل نمایش</Label>
            <Switch
              id="is_visible"
              checked={!!newResume.is_visible}
              onCheckedChange={checked => handleField("is_visible", checked)}
            />
          </div>
        </div>
      ),
      isValid: () =>
        newResume.job_title.length > 1 &&
        newResume.professional_summary.length > 1 &&
        newResume.employment_status.length > 1,
    },
    {
      label: "اطلاعات فردی",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="residence_province">استان محل سکونت</Label>
            <Select
              value={newResume.residence_province}
              onValueChange={value => handleField("residence_province", value)}
            >
              <SelectTrigger id="residence_province" className="mt-1 w-full" >
                <SelectValue placeholder="انتخاب استان محل سکونت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="آذربایجان شرقی">آذربایجان شرقی</SelectItem>
                <SelectItem value="آذربایجان غربی">آذربایجان غربی</SelectItem>
                <SelectItem value="اردبیل">اردبیل</SelectItem>
                <SelectItem value="اصفهان">اصفهان</SelectItem>
                <SelectItem value="البرز">البرز</SelectItem>
                <SelectItem value="ایلام">ایلام</SelectItem>
                <SelectItem value="بوشهر">بوشهر</SelectItem>
                <SelectItem value="تهران">تهران</SelectItem>
                <SelectItem value="چهارمحال و بختیاری">چهارمحال و بختیاری</SelectItem>
                <SelectItem value="خراسان جنوبی">خراسان جنوبی</SelectItem>
                <SelectItem value="خراسان رضوی">خراسان رضوی</SelectItem>
                <SelectItem value="خراسان شمالی">خراسان شمالی</SelectItem>
                <SelectItem value="خوزستان">خوزستان</SelectItem>
                <SelectItem value="زنجان">زنجان</SelectItem>
                <SelectItem value="سمنان">سمنان</SelectItem>
                <SelectItem value="سیستان و بلوچستان">سیستان و بلوچستان</SelectItem>
                <SelectItem value="فارس">فارس</SelectItem>
                <SelectItem value="قزوین">قزوین</SelectItem>
                <SelectItem value="قم">قم</SelectItem>
                <SelectItem value="کردستان">کردستان</SelectItem>
                <SelectItem value="کرمان">کرمان</SelectItem>
                <SelectItem value="کرمانشاه">کرمانشاه</SelectItem>
                <SelectItem value="کهگیلویه شو بویراحمد">کهگیلویه شو بویراحمد</SelectItem>
                <SelectItem value="گلستان">گلستان</SelectItem>
                <SelectItem value="گیلان">گیلان</SelectItem>
                <SelectItem value="لرستان">لرستان</SelectItem>
                <SelectItem value="مازندران">مازندران</SelectItem>
                <SelectItem value="مرکزی">مرکزی</SelectItem>
                <SelectItem value="هرمزگان">هرمزگان</SelectItem>
                <SelectItem value="همدان">همدان</SelectItem>
                <SelectItem value="یزد">یزد</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FormGroup
            label="آدرس محل سکونت"
            id="residence_address"
            value={newResume.residence_address}
            onChange={e => handleField("residence_address", e.target.value)}
          />
          <div>
            <Label htmlFor="marital_status">وضعیت تأهل</Label>
            <Select
              value={newResume.marital_status}
              onValueChange={value => handleField("marital_status", value)}
            >
              <SelectTrigger id="marital_status" className="mt-1 w-full">
                <SelectValue placeholder="انتخاب وضعیت تأهل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="مجرد">مجرد</SelectItem>
                <SelectItem value="متاهل">متاهل</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FormGroup
            label="سال تولد"
            id="birth_year"
            type="number"
            value={newResume.birth_year}
            onChange={e => handleField("birth_year", e.target.value)}
          />
          <div>
            <Label htmlFor="gender">جنسیت</Label>
            <Select
              value={newResume.gender}
              onValueChange={value => handleField("gender", value)}
            >
              <SelectTrigger id="gender" className="mt-1 w-full">
                <SelectValue placeholder="انتخاب جنسیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="مرد">مرد</SelectItem>
                <SelectItem value="زن">زن</SelectItem>
                <SelectItem value="سایر">سایر</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="military_service_status">وضعیت سربازی</Label>
            <Select
              value={newResume.military_service_status}
              onValueChange={value => handleField("military_service_status", value)}
            >
              <SelectTrigger id="military_service_status" className="mt-1 w-full">
                <SelectValue placeholder="انتخاب وضعیت سربازی" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="انجام شده">انجام شده</SelectItem>
                <SelectItem value="در حال انجام">در حال انجام</SelectItem>
                <SelectItem value="معوق">معوق</SelectItem>
                <SelectItem value="معاف از خدمت">معاف از خدمت</SelectItem>
                <SelectItem value="معافیت تحصیلی">معافیت تحصیلی</SelectItem>
                <SelectItem value="معافیت پزشکی">معافیت پزشکی</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
      isValid: () =>
        newResume.residence_province.length > 0 &&
        newResume.marital_status.length > 0 &&
        newResume.birth_year !== "",
    },
    {
      label: "تحصیلات",
      content: (
        <DynamicSection
          section="educations"
          title="مدارک تحصیلی"
          values={newResume.educations}
          onChange={handleArrField}
          add={() => addListItem("educations", { institution_name: "", degree: "", study_field: "", start_date: "", end_date: "", description: "" })}
          remove={i => removeListItem("educations", i)}
        />
      ),
      isValid: () =>
        newResume.educations[0]?.institution_name &&
        newResume.educations[0]?.degree,
    },
    {
      label: "مهارت‌ها",
      content: (
        <DynamicSection
          section="skills"
          title="مهارت"
          values={newResume.skills}
          onChange={handleArrField}
          add={() => addListItem("skills", { title: "", proficiency_level: "", has_certificate: false, certificate_issuing_organization: "", certificate_code: "", certificate_verification_status: "" })}
          remove={i => removeListItem("skills", i)}
          isSkill
        />
      ),
      isValid: () =>
        newResume.skills[0]?.title &&
        newResume.skills[0]?.proficiency_level,
    },
    {
      label: "سوابق شغلی",
      content: (
        <DynamicSection
          section="work_experiences"
          title="سابقه شغلی"
          values={newResume.work_experiences}
          onChange={handleArrField}
          add={() => addListItem("work_experiences", { title: "", company_name: "", start_date: "", end_date: "", description: "" })}
          remove={i => removeListItem("work_experiences", i)}
        />
      ),
      isValid: () =>
        newResume.work_experiences[0]?.title &&
        newResume.work_experiences[0]?.company_name,
    },
  ];

  const isEditOrAddMode = addMode || editMode;

  if (loading) {
    return (
      <div className="flex justify-center pt-20 transition-colors">
        <Toaster className="dana" richColors theme="system" />
        <LuLoaderCircle className="animate-spin h-8 w-8 mx-auto mt-10  text-black dark:text-white" />
      </div>
    );
  }

  return (
    <div className="p-3 md:p-8 w-full mx-auto transition-colors" dir="rtl">
      <Toaster className="dana" richColors theme="system" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold moraba text-gray-900 dark:text-white transition-colors tracking-tight">رزومه‌های من</h1>
        {!isEditOrAddMode && (
          <Button onClick={() => { setAddMode(true); setAddStep(0); setEditId(null); setEditMode(false); }} variant="secondary">
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              ساخت رزومه حرفه‌ای جدید
            </span>
          </Button>
        )}
      </div>
      {/* ADD OR EDIT MODAL */}
      {isEditOrAddMode && (
        <form
          onSubmit={editMode ? handleEditResume : handleAddResume}
          className="p-5 md:p-10  mx-auto animate-fadein"
        >
          <div className="mb-8">
            <Stepper
              steps={steps.map(st => st.label)}
              activeStep={addStep}
            />
          </div>
          <div className="mb-8">{steps[addStep].content}</div>
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="ghost"
              className="mr-auto  border border-solid border-gray-300"
              onClick={() => {
                if (editMode) {
                  setEditMode(false); setEditId(null);
                }
                setAddMode(false);
                setAddStep(0);
                setNewResume({
                  job_title: "",
                  professional_summary: "",
                  employment_status: "کارجو",
                  is_visible: true,
                  residence_province: "",
                  residence_address: "",
                  marital_status: "",
                  birth_year: "",
                  gender: "",
                  military_service_status: "",
                  educations: [{ institution_name: "", degree: "", study_field: "", start_date: "", end_date: "", description: "" }],
                  skills: [{ title: "", proficiency_level: "", has_certificate: false, certificate_issuing_organization: "", certificate_code: "", certificate_verification_status: "" }],
                  work_experiences: [{ title: "", company_name: "", start_date: "", end_date: "", description: "" }],
                });
              }}
            >لغو</Button>
            {addStep > 0 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                مرحله قبل
              </Button>
            )}
            {addStep < steps.length - 1 && (
              <Button
                type="button"
                className="bg-gradient-to-tr from-indigo-500 to-sky-600 text-white px-6"
                onClick={nextStep}
              >
                مرحله بعد
              </Button>
            )}
            {addStep === steps.length - 1 && (
              <Button
                type="submit"
                className="bg-gradient-to-tr from-blue-600 to-fuchsia-700 text-white px-7"
                disabled={submitLoading.add || submitLoading.edit || !steps[addStep].isValid()}
              >
                {submitLoading.add || submitLoading.edit
                  ? (editMode ? "در حال ویرایش..." : "در حال ثبت...")
                  : (editMode ? "ویرایش رزومه" : "ساخت رزومه حرفه‌ای")}
              </Button>
            )}
          </div>
        </form>
      )}

      {resumes.length === 0 && !isEditOrAddMode && (
        <div className="text-gray-500 dark:text-gray-400 text-center py-12">
          هنوز رزومه‌ای ثبت نکرده‌اید.
        </div>
      )}
      {!isEditOrAddMode && resumes.length > 0 && (
        <div className="space-y-8 max-w-5xl mx-auto">
          {resumes.map(resume => (
            <div
              key={resume.id}
              className="rounded-2xl shadow-xl bg-white/80 dark:bg-zinc-900/90 p-7 border border-zinc-100 dark:border-zinc-700 transition-colors relative hover:scale-[1.01] hover:shadow-2xl duration-200"
            >
              <div className="absolute top-5 left-5 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-indigo-500 text-indigo-700 dark:text-indigo-300 px-3"
                  onClick={async () => {
                    setAddMode(false);
                    setEditMode(true);
                    setAddStep(0);
                    setEditId(resume.id);
                    setNewResume(flattenResumeForEdit(resume));
                  }}
                >
                  <span className="flex items-center gap-1">
                    <LuPencil />
                    ویرایش
                  </span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="border-none text-red-600 hover:bg-red-500/10 px-3"
                  disabled={!!submitLoading[`del_${resume.id}`]}
                  onClick={async () => {
                    if (window.confirm("آیا از حذف این رزومه اطمینان دارید؟")) {
                      await handleDeleteResume(resume.id);
                    }
                  }}
                >
                  <span className="flex items-center gap-1">
                    <LuShieldX />
                    حذف
                  </span>
                </Button>
              </div>
              <h3 className="font-bold text-xl md:text-2xl text-fuchsia-800 dark:text-fuchsia-300 mb-2">{resume.job_title}</h3>
              <div className="text-zinc-700 dark:text-zinc-200 mb-2">{resume.professional_summary}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
                <div>
                  <div className="text-gray-500 dark:text-gray-400">وضعیت اشتغال</div>
                  <div className="font-semibold">{resume.employment_status}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">وضعیت نمایش</div>
                  <div className="font-semibold">{resume.is_visible ? "قابل مشاهده" : "پنهان"}</div>
                </div>
              </div>
              {!!resume.job_seeker_personal_information && (
                <div className="mt-4 border-t pt-4 border-dotted dark:border-zinc-700">
                  <span className="font-semibold text-lg text-indigo-700 dark:text-indigo-300">اطلاعات فردی</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                    {[
                      ["استان محل سکونت", resume.job_seeker_personal_information.residence_province],
                      ["آدرس", resume.job_seeker_personal_information.residence_address],
                      ["تأهل", resume.job_seeker_personal_information.marital_status],
                      ["سال تولد", resume.job_seeker_personal_information.birth_year],
                      ["جنسیت", resume.job_seeker_personal_information.gender],
                      ["وضعیت سربازی", resume.job_seeker_personal_information.military_service_status],
                    ].map(([k, v]) => (
                      <div key={k} className="text-zinc-800 dark:text-zinc-300"><span className="font-bold">{k}:</span> {v}</div>
                    ))}
                  </div>
                </div>
              )}
              {resume.job_seeker_educations && resume.job_seeker_educations.length > 0 && (
                <div className="mt-4">
                  <span className="font-semibold text-lg text-teal-700 dark:text-teal-300">تحصیلات</span>
                  <ul className="list-disc pr-5 mt-2">
                    {resume.job_seeker_educations.map((e, ei) =>
                      <li key={ei} className="text-zinc-700 dark:text-zinc-300">
                        {`${e.institution_name}، ${e.degree} (${e.start_date} - ${e.end_date})`}
                        {e.study_field && <span>، رشته: {e.study_field}</span>}
                        {e.description && <span>، توضیحات: {e.description}</span>}
                      </li>
                    )}
                  </ul>
                </div>
              )}
              {resume.job_seeker_skills && resume.job_seeker_skills.length > 0 && (
                <div className="mt-4">
                  <span className="font-semibold text-lg text-rose-700 dark:text-rose-300">مهارت‌ها</span>
                  <ul className="list-disc pr-5 mt-2">
                    {resume.job_seeker_skills.map((s, si) =>
                      <li key={si} className="text-zinc-700 dark:text-zinc-300">
                        {s.title} - {s.proficiency_level}
                        {s.has_certificate && <>
                          {" — "}
                          <span>گواهی: {s.certificate_issuing_organization} ({s.certificate_code}) </span>
                          <span className={(s.certificate_verification_status === "تایید شده" ? "text-green-600 dark:text-green-400" : "text-gray-500")}>
                            [{s.certificate_verification_status}]
                          </span>
                        </>}
                      </li>
                    )}
                  </ul>
                </div>
              )}
              {resume.job_seeker_work_experiences && resume.job_seeker_work_experiences.length > 0 && (
                <div className="mt-4">
                  <span className="font-semibold text-lg text-blue-700 dark:text-blue-300">سوابق شغلی</span>
                  <ul className="list-disc pr-5 mt-2">
                    {resume.job_seeker_work_experiences.map((w, wi) =>
                      <li key={wi} className="text-zinc-700 dark:text-zinc-300">
                        {`${w.title} در ${w.company_name} (${w.start_date} - ${w.end_date})`}
                        {w.description && <span>، توضیحات: {w.description}</span>}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stepper({ steps, activeStep }) {
  return (
    <div className="flex items-center max-w-3xl mx-auto mb-20">
      {steps.map((st, idx) => (
        <React.Fragment key={st}>
          <div
            className={[
              "flex-1 flex flex-col items-center transition-colors",
              idx < activeStep
                ? "text-sky-600 dark:text-sky-400"
                : idx === activeStep
                  ? "font-bold dark:text-white p-2 rounded-full text-black"
                  : "text-zinc-400"
            ].join(" ")}
          >
            <div
              className={[
                "rounded-full w-8 h-8 flex items-center justify-center text-lg mb-2",
                idx === activeStep
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : idx < activeStep
                    ? "bg-green-400 text-white"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
              ].join(" ")}
            >
              {idx + 1}
            </div>
            <span className="text-xs md:text-sm text-center">{st}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className="flex-1 h-1 mx-1 md:mx-2 rounded bg-gradient-to-r from-sky-500 via-zinc-200 to-fuchsia-400 dark:from-fuchsia-800 dark:to-sky-800" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function FormGroup({ label, id, value, onChange, type = "text", className = "", placeholder = "" }) {
  return (
    <div>
      <Label htmlFor={id} className="text-zinc-800 dark:text-zinc-200 transition-colors font-bold">{label}</Label>
      <Input
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        type={type}
        className={["mt-1 dark:placeholder-zinc-400", className].filter(Boolean).join(" ")}
        placeholder={placeholder}
      />
    </div>
  );
}

function DynamicSection({
  section,
  title,
  values,
  onChange,
  add,
  remove,
  isSkill = false,
}) {
  return (
    <div className=" p-4 rounded-lg shadow-sm space-y-8">
      {values.map((item, idx) => (
        <div key={idx} className="relative border rounded-xl mb-2 p-4 ">
          <div className="mb-2 font-semibold text-indigo-700 dark:text-indigo-200">{title} #{idx + 1}</div>
          {section === "educations" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup
                label="نام مرکز علمی"
                id={`institution_name_${idx}`}
                value={item.institution_name}
                onChange={e => onChange(section, idx, "institution_name", e.target.value)}
              />
              <div>
                <Label htmlFor={`degree_${idx}`} className="text-zinc-800 dark:text-zinc-200 transition-colors font-bold">
                  مدرک تحصیلی
                </Label>
                <Select
                  id={`degree_${idx}`}
                  value={item.degree}
                  onValueChange={value => onChange(section, idx, "degree", value)}
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="انتخاب مدرک تحصیلی" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="دبستان">دبستان</SelectItem>
                    <SelectItem value="متوسطه اول">متوسطه اول</SelectItem>
                    <SelectItem value="دبیرستان">دبیرستان</SelectItem>
                    <SelectItem value="دیپلم">دیپلم</SelectItem>
                    <SelectItem value="کاردانی">کاردانی</SelectItem>
                    <SelectItem value="کارشناسی">کارشناسی</SelectItem>
                    <SelectItem value="کارشناسی ارشد">کارشناسی ارشد</SelectItem>
                    <SelectItem value="دکتری">دکتری</SelectItem>
                    <SelectItem value="سایر">سایر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <FormGroup
                  label="رشته تحصیلی"
                  id={`study_field_${idx}`}
                  value={item.study_field}
                  onChange={e => onChange(section, idx, "study_field", e.target.value)}
                />
              </div>
              <FormGroup
                label="تاریخ شروع"
                id={`start_date_${idx}`}
                value={item.start_date}
                placeholder="1404/08/08"
                onChange={e => onChange(section, idx, "start_date", e.target.value)}
              />
              <FormGroup
                label="تاریخ پایان"
                id={`end_date_${idx}`}
                value={item.end_date}
                placeholder="1404/08/08"
                onChange={e => onChange(section, idx, "end_date", e.target.value)}
              />
              <div className="flex flex-col gap-1 col-span-2">
                <Label htmlFor={`description_${idx}`}>توضیحات</Label>
                <textarea
                  id={`description_${idx}`}
                  className="mt-1 w-full rounded border border-solid border-gray-300 dark:border-gray-900 dark:bg-zinc-900/50 dark:text-white p-2 resize-y min-h-[80px]"
                  value={item.description}
                  onChange={e => onChange(section, idx, "description", e.target.value)}
                />
              </div>
            </div>
          )}
          {section === "skills" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup
                label="عنوان مهارت"
                id={`title_${idx}`}
                value={item.title}
                onChange={e => onChange(section, idx, "title", e.target.value)}
              />
              <div>
                <Label htmlFor={`proficiency_level_${idx}`} className="text-zinc-800 dark:text-zinc-200">سطح مهارت</Label>
                <Select
                  value={item.proficiency_level}
                  onValueChange={value => onChange(section, idx, "proficiency_level", value)}
                >
                  <SelectTrigger id={`proficiency_level_${idx}`} className="mt-1 w-full">
                    <SelectValue placeholder="انتخاب سطح مهارت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مبتدی">مبتدی</SelectItem>
                    <SelectItem value="متوسط">متوسط</SelectItem>
                    <SelectItem value="حرفه‌ای">حرفه‌ای</SelectItem>
                    <SelectItem value="در حال یادگیری">در حال یادگیری</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 my-6">
                <Label className="text-zinc-800 dark:text-zinc-200 font-semibold" htmlFor={`has_certificate_${idx}`}>دارای گواهینامه</Label>
                <Switch
                  id={`has_certificate_${idx}`}
                  checked={!!item.has_certificate}
                  onCheckedChange={checked => onChange(section, idx, "has_certificate", checked)}
                  className="mx-2"
                  style={{ verticalAlign: "middle" }}
                />
              </div>
              {item.has_certificate && (
                <>
                  <FormGroup
                    label="سازمان صادرکننده گواهینامه"
                    id={`certificate_issuing_organization_${idx}`}
                    value={item.certificate_issuing_organization}
                    onChange={e => onChange(section, idx, "certificate_issuing_organization", e.target.value)}
                  />
                  <FormGroup
                    label="کد گواهینامه"
                    id={`certificate_code_${idx}`}
                    value={item.certificate_code}
                    onChange={e => onChange(section, idx, "certificate_code", e.target.value)}
                  />
                  <div>
                    <Label htmlFor={`certificate_verification_status_${idx}`} className="text-zinc-800 dark:text-zinc-200">
                      وضعیت تایید گواهی
                    </Label>
                    <Select
                      value={item.certificate_verification_status}
                      onValueChange={value => onChange(section, idx, "certificate_verification_status", value)}
                    >
                      <SelectTrigger id={`certificate_verification_status_${idx}`} className="mt-1 w-full">
                        <SelectValue placeholder="انتخاب وضعیت تایید" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="تایید شده">تایید شده</SelectItem>
                        <SelectItem value="در انتظار تایید">در انتظار تایید</SelectItem>
                        <SelectItem value="تایید نشده">تایید نشده</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          )}
          {section === "work_experiences" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup
                label="عنوان شغلی"
                id={`title_${idx}`}
                value={item.title}
                onChange={e => onChange(section, idx, "title", e.target.value)}
              />
              <FormGroup
                label="نام شرکت"
                id={`company_name_${idx}`}
                value={item.company_name}
                onChange={e => onChange(section, idx, "company_name", e.target.value)}
              />
              <FormGroup
                label="تاریخ شروع"
                id={`start_date_${idx}`}
                value={item.start_date}
                placeholder="1404/08/08"
                onChange={e => onChange(section, idx, "start_date", e.target.value)}
              />
              <FormGroup
                label="تاریخ پایان"
                id={`end_date_${idx}`}
                value={item.end_date}
                placeholder="1404/08/08"
                onChange={e => onChange(section, idx, "end_date", e.target.value)}
              />
              <div className="flex flex-col gap-1 col-span-2">
                <Label htmlFor={`description_${idx}`}>توضیحات</Label>
                <textarea
                  id={`description_${idx}`}
                  className="mt-1 w-full rounded border border-solid border-gray-300 dark:border-gray-900 dark:bg-zinc-900/50 dark:text-white p-2 resize-y min-h-[80px]"
                  value={item.description}
                  onChange={e => onChange(section, idx, "description", e.target.value)}
                />
              </div>
            </div>
          )}
          {values.length > 1 &&
            <Button
              type="button"
              variant="ghost"
              className="absolute left-3 top-3 text-red-500 border-0 bg-red-600/10 flex items-center justify-center"
              onClick={() => remove(idx)}
            >
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                حذف
              </span>
            </Button>
          }
        </div>
      ))}
      <div>
        <Button
          type="button"
          onClick={add}
          className="bg-gradient-to-tr from-rose-500 to-blue-600 text-sm text-white px-5 mt-2"
          variant="secondary"
        >
          افزودن {title}
        </Button>
      </div>
    </div>
  );
}
