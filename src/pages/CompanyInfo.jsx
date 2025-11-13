import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { toast , Toaster } from "sonner";
import useAxios from "@/hooks/useAxios";
import AuthContext from "@/context/authContext";

export default function CompanyInfo() {
    const navigate = useNavigate();
    const axiosInstance = useAxios();
    const { user } = useContext(AuthContext);
    

    const [form, setForm] = useState({
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
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (
            !form.registration_number ||
            !form.full_name ||
            !form.summary ||
            !form.industry ||
            !form.ownership_type ||
            !form.website_address ||
            !form.founded_year ||
            !form.employee_count ||
            !form.address ||
            !form.phone ||
            !form.description
        ) {
            toast.error("لطفا تمام فیلدها را پر کنید.");
            return;
        }

        if (!user || !user.user_id) {
            toast.error("خطا در دریافت اطلاعات کاربر");
            return;
        }

        setLoading(true);

        const data = {
            registration_number: form.registration_number,
            full_name: form.full_name,
            summary: form.summary,
            industry: form.industry,
            ownership_type: form.ownership_type,
            website_address: form.website_address,
            founded_year: parseInt(form.founded_year),
            employee_count: form.employee_count,
            address: form.address,
            phone: form.phone,
            description: form.description,
            user_id: user.user_id,
        };

        try {
            const res = await axiosInstance.post("/employer_companies/", data);
            console.log(res);

            if(res.status == 200){
                try {
                    await axiosInstance.patch(`/users/${user.user_id}`, {account_status: "فعال"});
                } catch (e) {
                    toast.error("فعال‌سازی حساب کاربری با خطا مواجه شد.");
                }
            }


            toast.success("اطلاعات شرکت با موفقیت ثبت شد.");
            // navigate("/");
        } catch (err) {
            if (err.response && err.response.data) {
                const errorData = err.response.data;
                if (typeof errorData === "object") {
                    const errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
                    toast.error(errorMessage);
                } else {
                    toast.error(errorData || "خطایی رخ داده است.");
                }
            } else {
                toast.error("خطا در ثبت اطلاعات شرکت، لطفا مجدد تلاش کنید.");
            }
            console.error("Company info error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const industries = [
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

    return (
        <div className="shadow-input mx-auto w-full max-w-2xl rounded-none p-4 md:rounded-2xl md:p-8 min-h-screen flex items-center justify-center flex-col">
            <Toaster className="dana" />
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-1 mb-10"
            >
                <HiOutlineLocationMarker className="text-4xl text-gray-800 dark:text-white" />
                <span className="text-3xl font-bold text-gray-800 dark:text-white moraba">
                    ثبت اطلاعات شرکت
                </span>
            </motion.div>

            <form className="my-8 p-0 w-full space-y-4" onSubmit={handleSubmit}>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    <LabelInputContainer>
                        <Label htmlFor="registration_number">شماره ثبت شرکت</Label>
                        <Input
                            id="registration_number"
                            name="registration_number"
                            placeholder="شماره ثبت شرکت"
                            type="text"
                            value={form.registration_number}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.18 }}
                >
                    <LabelInputContainer>
                        <Label htmlFor="full_name">نام کامل شرکت</Label>
                        <Input
                            id="full_name"
                            name="full_name"
                            placeholder="نام کامل شرکت"
                            type="text"
                            value={form.full_name}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.21 }}
                >
                    <LabelInputContainer>
                        <Label htmlFor="summary">خلاصه</Label>
                        <Textarea
                            id="summary"
                            name="summary"
                            placeholder="خلاصه‌ای از شرکت"
                            value={form.summary}
                            onChange={handleChange}
                            rows={3}
                        />
                    </LabelInputContainer>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.24 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <LabelInputContainer>
                        <Label htmlFor="industry">صنعت</Label>
                        <Select
                            value={form.industry}
                            onValueChange={(value) => handleSelectChange("industry", value)}
                        >
                            <SelectTrigger id="industry">
                                <SelectValue placeholder="انتخاب صنعت" />
                            </SelectTrigger>
                            <SelectContent>
                                {industries.map((industry) => (
                                    <SelectItem key={industry} value={industry}>
                                        {industry}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <Label htmlFor="ownership_type">نوع مالکیت</Label>
                        <Select
                            value={form.ownership_type}
                            onValueChange={(value) => handleSelectChange("ownership_type", value)}
                        >
                            <SelectTrigger id="ownership_type">
                                <SelectValue placeholder="انتخاب نوع مالکیت" />
                            </SelectTrigger>
                            <SelectContent>
                                {ownershipTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </LabelInputContainer>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.27 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <LabelInputContainer>
                        <Label htmlFor="website_address">آدرس وب‌سایت</Label>
                        <Input
                            id="website_address"
                            name="website_address"
                            placeholder="https://example.com"
                            type="url"
                            value={form.website_address}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <Label htmlFor="founded_year">سال تأسیس</Label>
                        <Input
                            id="founded_year"
                            name="founded_year"
                            placeholder="۱۳۹۰"
                            type="number"
                            min="1300"
                            max="1450"
                            value={form.founded_year}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <LabelInputContainer>
                        <Label htmlFor="employee_count">تعداد کارمندان</Label>
                        <Select
                            value={form.employee_count}
                            onValueChange={(value) => handleSelectChange("employee_count", value)}
                        >
                            <SelectTrigger id="employee_count">
                                <SelectValue placeholder="انتخاب تعداد کارمندان" />
                            </SelectTrigger>
                            <SelectContent>
                                {employeeCounts.map((count) => (
                                    <SelectItem key={count} value={count}>
                                        {count}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </LabelInputContainer>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.33 }}
                >
                    <LabelInputContainer>
                        <Label htmlFor="address">آدرس</Label>
                        <Textarea
                            id="address"
                            name="address"
                            placeholder="آدرس کامل شرکت"
                            value={form.address}
                            onChange={handleChange}
                            rows={2}
                        />
                    </LabelInputContainer>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.36 }}
                >
                    <LabelInputContainer>
                        <Label htmlFor="phone">شماره تماس</Label>
                        <Input
                            id="phone"
                            name="phone"
                            placeholder="شماره تماس شرکت"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.39 }}
                >
                    <LabelInputContainer>
                        <Label htmlFor="description">توضیحات</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="توضیحات تکمیلی درباره شرکت"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                        />
                    </LabelInputContainer>
                </motion.div>

                <motion.button
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.42 }}
                    className="group/btn bg-black relative block h-10 w-full rounded-md font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            در حال ثبت...
                        </span>
                    ) : "ثبت اطلاعات"}
                    <BottomGradient />
                </motion.button>
            </form>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    );
};

const LabelInputContainer = ({ children, className }) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};

