import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Link } from "react-router-dom";
import {
    IconBrandGithub,
    IconBrandGoogle,
    IconBrandOnlyfans,
} from "@tabler/icons-react";

export default function Signup() {
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("فرم ارسال شد");
    };

    return (
        <div className="shadow-input mx-auto w-full max-w-md rounded-none p-4 md:rounded-2xl md:p-8  min-h-screen flex items-center justify-center flex-col">
            <div className="flex items-center gap-1 mb-10">
                <HiOutlineLocationMarker className="text-4xl text-gray-800 dark:text-white" />

                <span className="text-3xl font-bold text-gray-800 dark:text-white moraba">
                    کاراینجا
                </span>
            </div>

            <form className="my-8 p-0 w-3/4 md:w-auto" onSubmit={handleSubmit}>
                <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:gap-x-2">
                    <LabelInputContainer>
                        <Label htmlFor="firstname">نام</Label>
                        <Input id="firstname" placeholder=" امیر" type="text" />
                    </LabelInputContainer>
                    <LabelInputContainer>
                        <Label htmlFor="lastname">نام خانوادگی</Label>
                        <Input id="lastname" placeholder=" رضایی" type="text" />
                    </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">ایمیل</Label>
                    <Input id="email" placeholder="example@email.com" type="email" />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">رمز عبور</Label>
                    <Input id="password" placeholder="••••••••" type="password" />
                </LabelInputContainer>
                <LabelInputContainer className="mb-8">
                    <Label htmlFor="twitterpassword">رمز عبور تکرار</Label>
                    <Input id="twitterpassword" placeholder="••••••••" type="password" />
                </LabelInputContainer>

                <button
                    className="group/btn bg-black relative block h-10 w-full rounded-md font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                    type="submit"
                >
                    ثبت‌نام
                </button>

                <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

                <div className="flex flex-col space-y-4">
                    <button
                        className="group/btn shadow-input relative flex h-10 w-full items-center justify-center gap-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
                        type="submit"
                    >
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            ثبت‌نام با
                        </span>
                        <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <BottomGradient />
                    </button>
                    <button
                        className="group/btn shadow-input relative flex h-10 w-full items-center justify-center gap-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
                        type="submit"
                    >
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            ثبت‌نام با
                        </span>
                        <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <BottomGradient />
                    </button>
                </div>
            </form>
            <p
                className="text-center mx-auto max-w-[19rem] !font-medium text-gray-600 mt-3 text-sm"
            >
                حساب کاربری دارید؟ <Link to={'/login'} className="inline text-blue-gray-900">وارد شوید</Link>
            </p>
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
