import React, { useEffect, useState, useContext } from "react";
import useAxios from "@/hooks/useAxios";
import { toast, Toaster } from "sonner";
import { LuLoaderCircle } from "react-icons/lu";
import { Switch } from "@/components/ui/switch";
import AuthContext from "@/context/authContext";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";


const NOTIFICATION_SETTINGS = [
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
    label:
      "اطلاع‌رسانی وقتی وضعیت درخواستم تغییر کرد (مثلاً دعوت به مصاحبه، رد شدن و…)"
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
  },
  {
    key: "notify_via_browser",
    label: "دریافت اعلان از طریق نوتیفیکیشن مرورگر"
  },
  {
    key: "notify_via_app",
    label: "دریافت اعلان از طریق اپلیکیشن موبایل (Push Notification)"
  },
  {
    key: "notify_similar_to_applied_jobs",
    label: "اطلاع‌رسانی مشاغل مشابه موقعیت‌هایی که قبلاً درخواست دادم"
  },
  {
    key: "suggest_remote_jobs",
    label: "دریافت پیشنهاد مشاغل دورکاری"
  },
  {
    key: "suggest_parttime_jobs",
    label: "دریافت پیشنهاد مشاغل پاره‌وقت"
  },
  {
    key: "suggest_fulltime_jobs",
    label: "دریافت پیشنهاد مشاغل تمام‌وقت"
  },
  {
    key: "notify_new_company_in_field",
    label: "اطلاع‌رسانی وقتی شرکت جدیدی در حوزه کاری من آگهی ثبت کرد"
  }
];

const SETTING_TEMPLATE = (userId) => ({
  value_type: "string",
  description: "",
  is_sensitive: false,
  is_active: true,
  user_id: userId
});

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState({});
  const [loadingInitial, setLoadingInitial] = useState(true);

  const axiosInstance = useAxios();

  const getSettingState = (key) => {
    if (settings[key] && settings[key].value) {
      if (settings[key].value === "true") return true;
      if (settings[key].value === "false") return false;
    }
    return false;
  };

  const fetchSettings = async () => {
    if (!user?.user_id) return;
    setLoadingInitial(true);
    try {
      const res = await axiosInstance.get(`/settings/?user_id=${user.user_id}&offset=0&limit=100`);
      const found = {};
      res.data.forEach((item) => {
        found[item.key] = item;
      });
      setSettings(found);
    } catch (err) {
      toast.error("دریافت تنظیمات انجام نشد");
    }
    setLoadingInitial(false);
  };

  const initializeSettings = async () => {
    if (!user?.user_id) return;
    await fetchSettings();
    const keysToInsert = NOTIFICATION_SETTINGS.filter(
      (s) => !settings[s.key]
    );
    if (keysToInsert.length === 0) return;

    for (const setting of keysToInsert) {
      try {
        await axiosInstance.post("/settings/", {
          key: setting.key,
          value: "true",
          ...SETTING_TEMPLATE(user.user_id),
          description: setting.label
        });
      } catch (err) {
      }
    }
    await fetchSettings();
  };

  useEffect(() => {
    if (!user?.user_id) return;
    initializeSettings();
  }, [user?.user_id]);

  const handleChange = async (key, checked) => {
    if (!user?.user_id) return;
    setLoading((prev) => ({ ...prev, [key]: true }));
    try {
      const id = settings[key]?.id;
      await axiosInstance.patch(`/settings/${id}`, {
        key,
        value: checked ? "true" : "false",
        value_type: "string",
        user_id: user.user_id
      });
      toast.success("تنظیمات ذخیره شد");
      await fetchSettings();
    } catch (err) {
      toast.error("مشکلی رخ داد. دوباره تلاش کنید");
    }
    setLoading((prev) => ({ ...prev, [key]: false }));
  };

  return (
    <div className="p-4 " dir="rtl">
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
                    checked={getSettingState(setting.key)}
                    onCheckedChange={(checked) => handleChange(setting.key, checked)}
                    disabled={!settings[setting.key] || loading[setting.key]}
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
