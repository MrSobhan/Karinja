import React, { useState } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import {
    IconBrandGithub,
    IconBrandGoogle
} from "@tabler/icons-react";
import { toast , Toaster } from "sonner";
import useAxios from "@/hooks/useAxios";

export default function Signup() {
    const navigate = useNavigate();
    const axiosInstance = useAxios();

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        role: "job_seeker",
        account_status: "غیر فعال"
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            toast.error("رمز عبور و تکرار آن یکسان نیستند.");
            return;
        }
        if (
            !form.full_name ||
            !form.email ||
            !form.phone ||
            !form.username ||
            !form.password ||
            !form.role
        ) {
            toast.error("لطفا تمام فیلدها (از جمله نقش) را پر کنید.");
            return;
        }

        setLoading(true);

        const data = {
            full_name: form.full_name,
            email: form.email,
            phone: form.phone,
            username: form.username,
            role: form.role,
            account_status: "غیر فعال",
            password: form.password
        };

        try {
            const res = await axiosInstance.post("/sign-up/", data, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            toast.success("ثبت‌نام با موفقیت انجام شد.");
            navigate("/login");
        } catch (err) {
            if (err.response && err.response.data && err.response.data.detail) {
                toast.error(err.response.data.detail || "خطایی رخ داده است.");
            } else {
                toast.error("خطا در ثبت‌نام، لطفا مجدد تلاش کنید.");
            }
        } finally {
            setLoading(false);
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="shadow-input mx-auto w-full max-w-md rounded-none p-4 md:rounded-2xl md:p-8 min-h-screen flex items-center justify-center flex-col">
            <Toaster className="dana" />
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-1 mb-10"
            >
                <Link to="/" className="flex items-center gap-1 mt-10">
                    <HiOutlineLocationMarker className="text-4xl text-gray-800 dark:text-white" />
                    <span className="text-3xl font-bold text-gray-800 dark:text-white moraba">
                        کاراینجا
                    </span>
                </Link>
            </motion.div>

            <form className="mb-8 p-0 w-full md:w-auto" onSubmit={handleSubmit}>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="mb-8"
                >
                    <LabelInputContainer>
                        <Label htmlFor="role">ثبت‌نام به عنوان</Label>
                        <div className="flex gap-2 mt-2">
                            <button
                                type="button"
                                className={`flex-1 py-2 rounded-md transition border-2 ${
                                    form.role === "job_seeker"
                                        ? "border-blue-500"
                                        : "border-gray-300 dark:border-zinc-700"
                                } bg-white dark:bg-zinc-900 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800`}
                                onClick={() => handleChange({ target: { name: "role", value: "job_seeker" } })}
                            >
                                کارجو
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-2 rounded-md transition border-2 ${
                                    form.role === "employer"
                                        ? "border-blue-500"
                                        : "border-gray-300 dark:border-zinc-700"
                                } bg-white dark:bg-zinc-900 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800`}
                                onClick={() => handleChange({ target: { name: "role", value: "employer" } })}
                            >
                                کارفرما
                            </button>
                        </div>
                    </LabelInputContainer>
                </motion.div>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.18 }}
                    className="mb-4 flex flex-col md:flex-row gap-2"
                >
                    <LabelInputContainer className="flex-1">
                        <Label htmlFor="full_name">نام و نام خانوادگی</Label>
                        <Input
                            id="full_name"
                            name="full_name"
                            placeholder="مثال: امیر رضایی"
                            type="text"
                            value={form.full_name}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>
                    <LabelInputContainer className="flex-1">
                        <Label htmlFor="phone">موبایل</Label>
                        <Input
                            id="phone"
                            name="phone"
                            placeholder="شماره موبایل"
                            type="text"
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>
                </motion.div>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.21 }}
                    className="mb-4 flex flex-col md:flex-row gap-2"
                >
                    <LabelInputContainer className="flex-1">
                        <Label htmlFor="username">نام کاربری</Label>
                        <Input
                            id="username"
                            name="username"
                            placeholder="نام کاربری"
                            type="text"
                            value={form.username}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>
                    <LabelInputContainer className="flex-1">
                        <Label htmlFor="email">ایمیل</Label>
                        <Input
                            id="email"
                            name="email"
                            placeholder="example@email.com"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>
                </motion.div>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.24 }}
                    className="mb-8 flex  gap-2"
                >
                    <LabelInputContainer className="flex-1">
                        <Label htmlFor="password">رمز عبور</Label>
                        <Input
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>
                    <LabelInputContainer className="flex-1">
                        <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="••••••••"
                            type="password"
                            value={form.confirmPassword || ""}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>
                </motion.div>
                <motion.button
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.27 }}
                    className="group/btn bg-black relative block text-base h-10 w-full rounded-md font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            در حال ثبت‌نام...
                        </span>
                    ) : "ثبت‌نام"}
                    <BottomGradient />
                </motion.button>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700"
                />
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.32 }}
                    className="flex flex-col space-y-4"
                >
                    <button
                        className="group/btn shadow-input relative flex h-10 w-full items-center justify-center gap-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
                        type="button"
                        disabled
                    >
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            ثبت‌نام با
                        </span>
                        <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <BottomGradient />
                    </button>
                    <button
                        className="group/btn shadow-input relative flex h-10 w-full items-center justify-center gap-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
                        type="button"
                        disabled
                    >
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            ثبت‌نام با
                        </span>
                        <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <BottomGradient />
                    </button>
                </motion.div>
            </form>
            <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 0.37 }}
                className="text-center mx-auto max-w-[19rem] !font-medium text-gray-600 mt-3 text-sm"
            >
                حساب کاربری دارید؟{" "}
                <Link to={"/login"} className="inline text-blue-gray-900">
                    وارد شوید
                </Link>
            </motion.p>
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