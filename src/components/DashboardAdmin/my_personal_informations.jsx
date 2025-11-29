import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import useAxios from "@/hooks/useAxios";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LuLoaderCircle } from "react-icons/lu";
import {
    Avatar, AvatarImage,
    AvatarFallback
} from "@/components/ui/avatar";
import {
    Card, CardContent,
    CardHeader
} from "@/components/ui/card";
import AuthContext from "@/context/authContext";

const initialUser = {
    full_name: "",
    email: "",
    phone: "",
    username: "",
    role: "",
    account_status: "",
    created_at: "",
};

const MyPersonalInformations = () => {
    const axiosInstance = useAxios();
    const fileInputRef = useRef();
    const { user } = useContext(AuthContext);

    const [userData, setUserData] = useState({ ...initialUser });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);

    // Fetch only user info
    const fetchUserData = useCallback(async () => {
        setLoading(true);
        try {
            const resUser = await axiosInstance.get(`/users/${user.user_id}`);
            setUserData(resUser.data);
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
            const payload = {
                full_name: userData.full_name || "",
                phone: userData.phone || ""
            };

            await axiosInstance.patch(`/users/${userData.id}/`, payload,);

            toast.success("اطلاعات با موفقیت ذخیره شد");
            fetchUserData();
        } catch (error) {
            toast.error("خطا در ذخیره‌سازی اطلاعات");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-w-[90%] lg:min-w-[70%] mx-auto py-6 px-2">
            <Toaster className="dana" />
            <div className="w-full">
                <CardHeader className="flex flex-col items-center space-y-4">
                    <Avatar className="w-28 h-28 shadow-xl ring-2 ring-sky-300 dark:ring-blue-600 hover:ring-4 transition-all">
                        <AvatarImage
                            src={avatarPreview || "https://png.pngtree.com/png-vector/20250606/ourmid/pngtree-3d-user-icon-on-blue-circle-isolated-transparent-background-white-png-image_16477931.png"}
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
                        <div className="flex justify-center items-center h-40">
                            <LuLoaderCircle className="animate-spin h-8 w-8 text-black dark:text-white" />
                        </div>
                    ) : (
                        <form onSubmit={handleSave} className="space-y-9" autoComplete="off">
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                </div>
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                </div>
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="role" className="font-medium mb-1">
                                            نقش کاربر
                                        </Label>
                                        <Input
                                            id="role"
                                            value={userData.role}
                                            disabled
                                            className="mt-2 bg-gray-50 dark:bg-zinc-900/30 text-gray-400"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="account_status" className="font-medium mb-1">
                                            وضعیت حساب
                                        </Label>
                                        <Input
                                            id="account_status"
                                            value={userData.account_status}
                                            disabled
                                            className="mt-2 bg-gray-50 dark:bg-zinc-900/30 text-gray-400"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="created_at" className="font-medium mb-1">
                                        تاریخ ایجاد
                                    </Label>
                                    <Input
                                        id="created_at"
                                        value={
                                            userData.created_at
                                                ? new Date(userData.created_at).toLocaleDateString("fa-IR", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                })
                                                : ""
                                        }
                                        disabled
                                        className="mt-2 bg-gray-50 dark:bg-zinc-900/30 text-gray-400"
                                    />
                                </div>
                            </section>
                            <div className="pt-8">
                                <Button
                                    className=" py-3 rounded-lg text-base shadow-xl hover:scale-105 active:scale-98 transition"
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