import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import {
    IconBrandGithub,
    IconBrandGoogle,
} from "@tabler/icons-react";

import AuthContext from "@/context/authContext";
import { toast, Toaster } from "sonner";

export default function Login() {
    const { LoginUser, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await LoginUser(username, password);
        if (result) {
            if (!result.userInfo) {
                navigate("/company-info");
                return;
            }

            if (result.user_status === "غیر فعال") {
                toast.error("اکانت شما مسدود شده است لطفا تیکت ثبت کنید");
            }

            navigate("/");
        } else {
            toast.error("نام کاربری یا گذرواژه اشتباه است");
        }
        setLoading(false);
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="shadow-input mx-auto w-full max-w-md rounded-none p-0 md:rounded-2xl md:p-8 min-h-screen flex items-center justify-center flex-col">
            <Toaster className="dana" />
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-1 mb-5"
            >
                <Link to="/" className="flex items-center gap-1 mb-10">
                    <HiOutlineLocationMarker className="text-4xl text-gray-800 dark:text-white" />
                    <span className="text-3xl font-bold text-gray-800 dark:text-white moraba">
                        کاراینجا
                    </span>
                </Link>
            </motion.div>

            <form className="my-8 px-8 w-full" onSubmit={handleSubmit}>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="email">نام کاربری</Label>
                        <Input
                            id="username"
                            placeholder="نام کاربری خود را وارد کنید"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </LabelInputContainer>
                </motion.div>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="password">رمز عبور</Label>
                        <Input
                            id="password"
                            placeholder="••••••••"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </LabelInputContainer>
                </motion.div>

                <motion.button
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="group/btn bg-black relative text-base h-10 w-full rounded-md font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] flex items-center justify-center gap-2"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            در حال ورود...
                        </span>
                    ) : "ورود"}
                    <BottomGradient />
                </motion.button>


                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700"
                />

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex flex-col space-y-4"
                >
                    <button
                        className="group/btn shadow-input relative flex h-10 w-full items-center justify-center gap-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
                        type="submit"
                    >
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            ورود با
                        </span>
                        <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <BottomGradient />
                    </button>
                    <button
                        className="group/btn shadow-input relative flex h-10 w-full items-center justify-center gap-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
                        type="submit"
                    >
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            ورود با
                        </span>
                        <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <BottomGradient />
                    </button>
                </motion.div>
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="text-center mx-auto max-w-[19rem] !font-medium text-gray-600 mt-10 text-sm"
                >
                    حساب کاربری ندارید؟{" "}
                    <Link to={'/singup'} className="inline text-blue-gray-900">
                        ثبت نام کنید
                    </Link>
                </motion.p>
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