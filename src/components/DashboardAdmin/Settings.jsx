import React, { useEffect, useState, useContext, useRef } from "react";
import useAxios from "@/hooks/useAxios";
import { toast, Toaster } from "sonner";
import { LuLoaderCircle } from "react-icons/lu";
import { Switch } from "@/components/ui/switch";
import AuthContext from "@/context/authContext";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const NOTIFICATION_SETTINGS = [
  // به تعداد دلخواه 10 تا قرار بده، اگر بیشتره در صورت نیاز کم کن
  {
    key: "receive_similar_job_ads",
    label: "دریافت آگهی‌های شغلی جدید مرتبط با رزومه‌ام"
  },
  {
    key: "daily_or_weekly_suggested_jobs",
    label: "ارسال فرصت‌های شغلی پیشنهادی روزانه/هفتگی"
  },
  {
    key: "notify_when_employer_views_resume",
    label: "اطلاع‌رسانی وقتی کارفرما رزومه‌ام را دیده"
  },
  {
    key: "notify_when_request_status_changes",
    label: "اطلاع‌رسانی وقتی وضعیت درخواستم تغییر کرد (مثلاً دعوت به مصاحبه، رد شدن و…)"
  },
  {
    key: "receive_new_message_from_employer",
    label: "دریافت پیام جدید از کارفرما"
  },
  {
    key: "notify_invite_to_interview",
    label: "اطلاع‌رسانی دعوت به مصاحبه"
  },
  {
    key: "newsletter_and_job_tips",
    label: "ارسال خبرنامه و نکات کاریابی (معمولاً هفته‌ای یک بار)"
  },
  {
    key: "special_offers_and_discounts",
    label: "دریافت پیشنهادهای ویژه و تخفیف بسته‌های پولی"
  },
  {
    key: "notify_saved_ad_near_deadline",
    label: "اطلاع‌رسانی وقتی آگهی‌ای که ذخیره کردم نزدیک مهلت است"
  },
  {
    key: "job_alert_email",
    label: "دریافت اعلان ازان جاب (Job Alert) از طریق ایمیل"
  }
  // اگر بیشتره حذف کن یا نیاز داشتی اضافه کن
];

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [disabledSettings, setDisabledSettings] = useState({});
  const [loading, setLoading] = useState({});
  const [loadingInitial, setLoadingInitial] = useState(true);
  const initializing = useRef(false);
  const axiosInstance = useAxios();

  useEffect(() => {
    if (!user?.user_id) return;
    let canceled = false;

    const loadSettings = async () => {
      if (initializing.current) return;
      initializing.current = true;
      setLoadingInitial(true);

      try {
        const res = await axiosInstance.get(
          `/settings/search/?user_id=${user.user_id}&operator=AND&offset=0&limit=100`
        );
        const _falses = {};
        res.data.forEach(item => {
          if (item.value === "false") {
            _falses[item.key] = item;
          }
        });
        if (!canceled) {
          setDisabledSettings(_falses);
        }
      } catch (err) {
        toast.error("دریافت تنظیمات انجام نشد");
        setDisabledSettings({});
        console.log(err);
      }
      setLoadingInitial(false);
      initializing.current = false;
    };

    loadSettings();
    return () => {
      canceled = true;
    };
  }, [user?.user_id]);

  const isEnabled = (key) => !(key in disabledSettings);

  const handleChange = async (key, checked) => {
    if (!user?.user_id) return;
    setLoading(prev => ({ ...prev, [key]: true }));
    try {
      if (!checked) {
        await axiosInstance.post("/settings", {
          key,
          value: "false",
          value_type: "string",
          description: NOTIFICATION_SETTINGS.find(n => n.key === key)?.label || "",
          is_sensitive: false,
          is_active: true,
          user_id: user.user_id
        });
        setDisabledSettings(prev => ({
          ...prev, [key]: { value: "false" }
        }));
        toast.success("ذخیره شد");
      } else {
        const item = disabledSettings[key];
        if (item?.id) {
          await axiosInstance.delete(`/settings/${item.id}`);
        } else {
          try {
            const res = await axiosInstance.get(`/settings/search/?user_id=${user.user_id}&key=${key}`);
            if (res.data?.[0]?.id) {
              await axiosInstance.delete(`/settings/${res.data[0].id}`);
            }
          } catch {}
        }
        setDisabledSettings(prev => {
          const p = { ...prev };
          delete p[key];
          return p;
        });
        toast.success("ذخیره شد");
      }
    } catch (err) {
      toast.error("مشکلی رخ داد، دوباره تلاش کنید");
      console.log(err);
    }
    setLoading(prev => ({ ...prev, [key]: false }));
  };

  return (
    <div className="p-4" dir="rtl">
      <Toaster className="dana" />
      <Card className="p-6 border-none shadow-none">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <h1 className="text-2xl font-semibold moraba text-gray-800 dark:text-white">
            مدیریت اعلان‌ها و تنظیمات کاربری
          </h1>
        </div>
        {loadingInitial ? (
          <div className="grid gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Card key={`skeleton-${idx}`} className="border border-dashed">
                <div className="space-y-3 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="animate-pulse bg-primary/10 rounded-md h-5 w-48 mb-2" />
                      <div className="animate-pulse bg-primary/10 rounded-md h-4 w-36" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="animate-pulse bg-primary/10 rounded-full h-7 w-12" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-5 mt-10">
            {NOTIFICATION_SETTINGS.map((setting) => (
              <div
                key={setting.key}
                className="flex items-center justify-between border-b last:border-b-0 py-2"
              >
                <div>
                  <Label htmlFor={setting.key} className="text-base font-medium">
                    {setting.label}
                  </Label>
                </div>
                <div className="flex items-center">
                  <Switch
                    id={setting.key}
                    checked={isEnabled(setting.key)}
                    onCheckedChange={checked => handleChange(setting.key, checked)}
                    disabled={loading[setting.key] || loadingInitial}
                  />
                  {loading[setting.key] && (
                    <LuLoaderCircle className="animate-spin h-5 w-5 ml-2 text-black dark:text-white" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Settings;
