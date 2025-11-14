import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import useAxios from "@/hooks/useAxios";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select, SelectItem,
    SelectContent,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Avatar, AvatarImage,
    AvatarFallback
} from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
    Card, CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"
import AuthContext from "@/context/authContext";

const initialUser = {
    full_name: "",
    email: "",
    phone: "",
    username: "",
    role: "",
    account_status: "",
    id: "",
    created_at: "",
    updated_at: "",
    avatar_url: "",
};

const initialJobSeekerResume = {
    job_title: "",
    professional_summary: "",
    employment_status: "",
    is_visible: true,
    id: "",
};

const initialJobSeekerInfo = {
    residence_province: "",
    residence_address: "",
    marital_status: "",
    birth_year: "",
    gender: "",
    military_service_status: "",
    id: "",
    job_seeker_resume: { ...initialJobSeekerResume },
};

const provinces = [
    "آذربایجان شرقی",
    "آذربایجان غربی",
    "اردبیل",
    "اصفهان",
    "البرز",
    "ایلام",
    "بوشهر",
    "تهران",
    "چهارمحال و بختیاری",
    "خراسان جنوبی",
    "خراسان رضوی",
    "خراسان شمالی",
    "خوزستان",
    "زنجان",
    "سمنان",
    "سیستان و بلوچستان",
    "فارس",
    "قزوین",
    "قم",
    "کردستان",
    "کرمان",
    "کرمانشاه",
    "کهگیلویه و بویراحمد",
    "گلستان",
    "گیلان",
    "لرستان",
    "مازندران",
    "مرکزی",
    "هرمزگان",
    "همدان",
    "یزد",
];

const MyPersonalInformations = () => {
    const axiosInstance = useAxios();
    const fileInputRef = useRef();
    const { user } = useContext(AuthContext);

    const [userData, setUserData] = useState({ ...initialUser });
    const [info, setInfo] = useState({ ...initialJobSeekerInfo });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);

    // Fetch user and info
    const fetchUserData = useCallback(async () => {
        setLoading(true);
        try {
            // userFromContext.user_id
            const resUser = await axiosInstance.get(`/user/${user.user_id}`);
            console.log(resUser);
            
            setUserData(resUser.data);

            const resJobSeeker = await axiosInstance.get(
                `/job_seeker_personal_informations/?user_id=${resUser.data.id}`
            );
            let jsInfo =
                Array.isArray(resJobSeeker.data) && resJobSeeker.data.length > 0
                    ? resJobSeeker.data[0]
                    : { ...initialJobSeekerInfo };

            if (!jsInfo.job_seeker_resume) {
                jsInfo.job_seeker_resume = { ...initialJobSeekerResume };
            }
            setInfo({
                ...initialJobSeekerInfo,
                ...jsInfo,
                job_seeker_resume: {
                    ...initialJobSeekerResume,
                    ...jsInfo.job_seeker_resume,
                },
            });

            setAvatarPreview(resUser.data.avatar_url || "");
        } catch (e) {
            toast.error("خطا در دریافت اطلاعات کاربر");
        } finally {
            setLoading(false);
        }
    }, [axiosInstance, user.user_id]);

    useEffect(() => {
        if (user?.user_id) {
            fetchUserData();
        }
        // eslint-disable-next-line
    }, [user?.user_id]);

    // Handlers
    const handleUserChange = (field) => (e) => {
        setUserData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleInfoChange = (field) => (value) => {
        setInfo((prev) => ({ ...prev, [field]: value }));
    };

    const handleResumeChange = (field) => (value) => {
        setInfo((prev) => ({
            ...prev,
            job_seeker_resume: {
                ...prev.job_seeker_resume,
                [field]: value,
            },
        }));
    };

    const handleTextResumeChange = (field) => (e) => {
        setInfo((prev) => ({
            ...prev,
            job_seeker_resume: {
                ...prev.job_seeker_resume,
                [field]: e.target.value,
            },
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // User info
            const formData = new FormData();
            formData.append("full_name", userData.full_name || "");
            formData.append("phone", userData.phone || "");
            if (avatarFile) formData.append("avatar", avatarFile);

            await axiosInstance.patch(`/user/${userData.id}/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // JobSeeker Personal Informations
            const jsPayload = {
                residence_province: info.residence_province,
                residence_address: info.residence_address,
                marital_status: info.marital_status,
                birth_year: info.birth_year,
                gender: info.gender,
                military_service_status: info.military_service_status,
            };

            if (info.id) {
                await axiosInstance.patch(
                    `/job_seeker_personal_informations/${info.id}/`,
                    jsPayload
                );
            } else {
                await axiosInstance.post("/job_seeker_personal_informations/", {
                    ...jsPayload,
                    user: user.user_id,
                });
            }

            // Resume info
            if (info.job_seeker_resume?.id) {
                await axiosInstance.patch(
                    `/job_seeker_resumes/${info.job_seeker_resume.id}/`,
                    {
                        job_title: info.job_seeker_resume.job_title,
                        professional_summary: info.job_seeker_resume.professional_summary,
                        employment_status: info.job_seeker_resume.employment_status,
                        is_visible: info.job_seeker_resume.is_visible,
                    }
                );
            }
            toast.success("اطلاعات با موفقیت ذخیره شد");
            fetchUserData();
        } catch (error) {
            toast.error("خطا در ذخیره‌سازی اطلاعات");
        } finally {
            setSaving(false);
        }
    };

    // UI with shadcn inputs, attractive/modern

    // Utility for SelectItem placeholders with non-empty value prop
    const PLACEHOLDER_PROVINCE = "__select_province__";
    const PLACEHOLDER_GENDER = "__select_gender__";
    const PLACEHOLDER_MARITAL = "__select_marital__";
    const PLACEHOLDER_MILITARY = "__select_military__";
    const PLACEHOLDER_EMPLOYMENT = "__select_employment__";

    return (
        <div className="min-w-[70%] mx-auto py-6 px-2">
            <Toaster className="dana" />
            <div className="w-full">
                <CardHeader className="flex flex-col items-center space-y-4">
                    <Avatar className="w-28 h-28 shadow-xl ring-2 ring-sky-300 dark:ring-indigo-600 hover:ring-4 transition-all">
                        <AvatarImage
                            src={avatarPreview || "/src/image/user4.webp"}
                            alt="avatar"
                            className="object-cover"
                            onClick={() => fileInputRef.current?.click()}
                        />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-12 text-gray-500 text-lg animate-pulse">
                            در حال بارگذاری...
                        </div>
                    ) : (
                        <form onSubmit={handleSave} className="space-y-9" autoComplete="off">
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="full_name" className="font-medium mb-1">
                                        نام و نام خانوادگی
                                    </Label>
                                    <Input
                                        id="full_name"
                                        placeholder="نام و نام خانوادگی"
                                        value={userData.full_name}
                                        onChange={handleUserChange("full_name")}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone" className="font-medium mb-1">
                                        شماره همراه
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="شماره همراه"
                                        value={userData.phone}
                                        onChange={handleUserChange("phone")}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email" className="font-medium mb-1">
                                        ایمیل
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={userData.email}
                                        disabled
                                        className="mt-2 bg-gray-50 dark:bg-zinc-900/30 text-gray-400"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="username" className="font-medium mb-1">
                                        نام کاربری
                                    </Label>
                                    <Input
                                        id="username"
                                        value={userData.username}
                                        disabled
                                        className="mt-2 bg-gray-50 dark:bg-zinc-900/30 text-gray-400"
                                    />
                                </div>
                            </section>
                            <section>
                                <h3 className="mt-4 mb-2 text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                                    اطلاعات تکمیلی
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="residence_province" className="font-medium mb-1">
                                            استان محل سکونت
                                        </Label>
                                        <Select
                                            value={info.residence_province || PLACEHOLDER_PROVINCE}
                                            onValueChange={handleInfoChange("residence_province")}
                                        >
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="انتخاب استان" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    value={PLACEHOLDER_PROVINCE}
                                                    disabled
                                                    hidden
                                                >
                                                    انتخاب استان
                                                </SelectItem>
                                                {provinces.map((p) => (
                                                    <SelectItem key={p} value={p}>
                                                        {p}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="residence_address" className="font-medium mb-1">
                                            آدرس محل سکونت
                                        </Label>
                                        <Input
                                            id="residence_address"
                                            placeholder="آدرس محل سکونت"
                                            value={info.residence_address}
                                            onChange={(e) =>
                                                handleInfoChange("residence_address")(e.target.value)
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="birth_year" className="font-medium mb-1">
                                            سال تولد
                                        </Label>
                                        <Input
                                            id="birth_year"
                                            type="number"
                                            min="1300"
                                            max="1500"
                                            placeholder="مثلاً 1375"
                                            value={info.birth_year || ""}
                                            onChange={(e) =>
                                                handleInfoChange("birth_year")(e.target.value)
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="gender" className="font-medium mb-1">
                                            جنسیت
                                        </Label>
                                        <Select
                                            value={info.gender || PLACEHOLDER_GENDER}
                                            onValueChange={handleInfoChange("gender")}
                                        >
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="انتخاب جنسیت" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    value={PLACEHOLDER_GENDER}
                                                    disabled
                                                    hidden
                                                >
                                                    انتخاب جنسیت
                                                </SelectItem>
                                                <SelectItem value="مرد">مرد</SelectItem>
                                                <SelectItem value="زن">زن</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="marital_status" className="font-medium mb-1">
                                            وضعیت تاهل
                                        </Label>
                                        <Select
                                            value={info.marital_status || PLACEHOLDER_MARITAL}
                                            onValueChange={handleInfoChange("marital_status")}
                                        >
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="انتخاب وضعیت" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    value={PLACEHOLDER_MARITAL}
                                                    disabled
                                                    hidden
                                                >
                                                    انتخاب وضعیت
                                                </SelectItem>
                                                <SelectItem value="مجرد">مجرد</SelectItem>
                                                <SelectItem value="متاهل">متاهل</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="military_service_status" className="font-medium mb-1">
                                            وضعیت نظام وظیفه
                                        </Label>
                                        <Select
                                            value={info.military_service_status || PLACEHOLDER_MILITARY}
                                            onValueChange={handleInfoChange("military_service_status")}
                                        >
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="انتخاب وضعیت" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    value={PLACEHOLDER_MILITARY}
                                                    disabled
                                                    hidden
                                                >
                                                    انتخاب وضعیت
                                                </SelectItem>
                                                <SelectItem value="انجام شده">انجام شده</SelectItem>
                                                <SelectItem value="معاف">معاف</SelectItem>
                                                <SelectItem value="در حال خدمت">در حال خدمت</SelectItem>
                                                <SelectItem value="سایر">سایر</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <h3 className="mt-6 mb-2 text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                                    رزومه مختصر
                                </h3>
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="job_title" className="font-medium mb-1">
                                                عنوان شغلی
                                            </Label>
                                            <Input
                                                id="job_title"
                                                placeholder="عنوان شغلی"
                                                value={info.job_seeker_resume?.job_title || ""}
                                                onChange={handleTextResumeChange("job_title")}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="employment_status" className="font-medium mb-1">
                                                وضعیت اشتغال
                                            </Label>
                                            <Select
                                                value={info.job_seeker_resume?.employment_status || PLACEHOLDER_EMPLOYMENT}
                                                onValueChange={handleResumeChange("employment_status")}
                                            >
                                                <SelectTrigger className="mt-2">
                                                    <SelectValue placeholder="انتخاب وضعیت" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem
                                                        value={PLACEHOLDER_EMPLOYMENT}
                                                        disabled
                                                        hidden
                                                    >
                                                        انتخاب وضعیت
                                                    </SelectItem>
                                                    <SelectItem value="کارجو">کارجو</SelectItem>
                                                    <SelectItem value="شاغل">شاغل</SelectItem>
                                                    <SelectItem value="دانشجو">دانشجو</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="professional_summary" className="font-medium mb-1">
                                            خلاصه سوابق / توضیحات
                                        </Label>
                                        <Textarea
                                            id="professional_summary"
                                            rows={2}
                                            placeholder="توضیح مختصر درباره تخصص یا تجربه‌تان بنویسید"
                                            value={info.job_seeker_resume?.professional_summary || ""}
                                            onChange={handleTextResumeChange("professional_summary")}
                                            className="mt-2 resize-none"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        <Switch
                                            checked={
                                                typeof info.job_seeker_resume?.is_visible === "boolean"
                                                    ? info.job_seeker_resume.is_visible
                                                    : true
                                            }
                                            onCheckedChange={(value) =>
                                                handleResumeChange("is_visible")(value)
                                            }
                                            id="is_visible"
                                        />
                                        <Label htmlFor="is_visible" className="cursor-pointer text-gray-700 dark:text-gray-300">
                                            نمایش عمومی رزومه
                                        </Label>
                                    </div>
                                </div>
                            </section>
                            <div className="pt-8">
                                <Button
                                    className=" py-3 rounded-xl text-base shadow-xl hover:scale-105 active:scale-98 transition"
                                    disabled={saving}
                                    type="submit"
                                    size="lg"
                                >
                                    {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </div>
        </div>
    );
};

export default MyPersonalInformations;