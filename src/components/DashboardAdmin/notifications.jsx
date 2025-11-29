import React, { useEffect, useState, useContext } from "react";
import useAxios from "@/hooks/useAxios";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LuLoaderCircle, LuTrash, LuSend, LuCheck } from "react-icons/lu";
import { CiBellOff } from "react-icons/ci";
import AuthContext from "@/context/authContext";

const Tabs = ({ tabs, activeTab, onChange }) => (
  <div className="flex border-b mb-6">
    {tabs.map((tab) => (
      <button
        key={tab.value}
        onClick={() => onChange(tab.value)}
        className={
          `font-bold px-6 py-2 border-b-2 transition
          ${activeTab === tab.value
            ? 'border-blue-700 text-blue-700 dark:text-blue-400 dark:border-blue-400 bg-blue-100/50 dark:bg-blue-600/10'
            : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-900'}`
        }
        type="button"
      >
        {tab.label}
      </button>
    ))}
  </div>
);

const NOTIF_TYPES = [
  { value: "اطلاع‌رسانی", label: "اطلاع‌رسانی" },
  { value: "فوری", label: "فوری" },
  { value: "یادآوری", label: "یادآوری" },
  { value: "هشدار", label: "هشدار" },
  { value: "تبلیغاتی", label: "تبلیغاتی" },
  { value: "سیستمی", label: "سیستمی" },
];

const notificationSchema = z.object({
  type: z.enum(NOTIF_TYPES.map(t => t.value)),
  message: z.string().min(1, "پیام لازم است"),
  is_read: z.boolean(),
  user_id: z.string().uuid("کاربر نامعتبر است"),
});

const typeColorClass = (type) => {
  switch (type) {
    case "اطلاع‌رسانی": return "text-sky-600 bg-sky-50 dark:bg-sky-900/20";
    case "فوری": return "text-red-600 bg-red-50 dark:bg-red-900/20";
    case "یادآوری": return "text-amber-700 bg-amber-50 dark:bg-amber-900/20";
    case "هشدار": return "text-orange-600 bg-orange-50 dark:bg-orange-900/20";
    case "تبلیغاتی": return "text-pink-600 bg-pink-50 dark:bg-pink-900/20";
    case "سیستمی": return "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20";
    default: return "text-sky-600";
  }
};

const NotificationBox = ({
  notif,
  onDelete,
  onMarkRead,
  deleting,
  markingRead,
  currentUser,
  type
}) => {
  return (
    <div className={`bg-white dark:bg-gray-950/60 rounded-lg shadow flex gap-4 p-4 border mb-4 ${notif.is_read ? 'opacity-70' : 'border-blue-400'}`}>
      <div className="flex-grow">
        <div className="flex gap-2 items-center mb-1">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full transition whitespace-nowrap ${typeColorClass(notif.type)}`}
            style={{ minWidth: 78, display: "inline-block", textAlign: "center" }}
            title={notif.type}
          >
            {notif.type}
          </span>
          <span className="text-xs text-gray-500">{new Date(notif.created_at).toLocaleString("fa")}</span>
          {notif.is_read && <LuCheck className="inline ml-1 text-blue-500" title="خوانده شده" />}
        </div>
        <div className="font-medium text-zinc-900 dark:text-zinc-100 my-4">{notif.message}</div>
        <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-2">
          {type === "inbox" && notif.sender && notif.sender.username ? (
            <>
              ارسال‌کننده: <span className="font-semibold">{notif.sender.full_name}</span> (<span dir="ltr">{notif.sender.username}</span>)
            </>
          ) : null}
          {type === "sent" && notif.user && notif.user.username ? (
            <>
              برای: <span className="font-semibold">{notif.user.full_name}</span> (<span dir="ltr">{notif.user.username}</span>)
            </>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-2 min-w-fit">
        {type === "inbox" && !notif.is_read && (
          <Button
            size="icon"
            disabled={markingRead}
            onClick={() => onMarkRead(notif.id)}
            title="علامت به عنوان خوانده شده"
            className="bg-green-800/20 text-green-600"
          >
            {markingRead ? <LuLoaderCircle className="animate-spin" /> : <LuCheck />}
          </Button>
        )}
        <Button
          size="icon"
          disabled={deleting}
          onClick={() => onDelete(notif.id)}
          title="حذف"
          className="bg-red-800/20 text-red-600"
        >
          {deleting ? <LuLoaderCircle className="animate-spin" /> : <LuTrash />}
        </Button>
      </div>
    </div>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [activeTab, setActiveTab] = useState("inbox");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [formData, setFormData] = useState({
    type: NOTIF_TYPES[0].value,
    message: "",
    is_read: false,
    user_id: "",
  });
  const [errors, setErrors] = useState({});
  const [loadingSend, setLoadingSend] = useState(false);

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [markReadTargetId, setMarkReadTargetId] = useState(null);

  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);

  const isAdmin = ["admin", "full_admin"].includes(user?.user_role);

  const tabOptionsAdmin = [
    { value: "inbox", label: "صندوق دریافت" },
    { value: "sent", label: "صندوق ارسال" },
  ];
  const tabOptionsUser = [
    { value: "inbox", label: "صندوق دریافت" }
  ];
  const tabsToShow = isAdmin ? tabOptionsAdmin : tabOptionsUser;

  const fetchNotifications = async () => {
    setLoadingList(true);
    try {
      const res = await axiosInstance.get(`/notifications`);
      setNotifications(res.data);
    } catch (e) {
      toast.error("خطا در دریافت نوتیفیکیشن‌ها");
    }
    setLoadingList(false);
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axiosInstance.get(`/users/?offset=0&limit=100`);
      setUsersData(res.data);
    } catch (e) {
      toast.error("خطا در دریافت کاربران");
    }
    setLoadingUsers(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const openSendModal = () => {
    fetchUsers();
    setFormData({
      type: NOTIF_TYPES[0].value,
      message: "",
      is_read: false,
      user_id: "",
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendNotif = async (e) => {
    e.preventDefault();
    setLoadingSend(true);
    try {
      const validData = notificationSchema.parse(formData);
      setErrors({});
      await axiosInstance.post(`/notifications`, validData);
      toast.success("نوتیفیکیشن با موفقیت ارسال شد");
      setIsModalOpen(false);
      setFormData({
        type: NOTIF_TYPES[0].value,
        message: "",
        is_read: false,
        user_id: "",
      });
      fetchNotifications();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast.error("خطا در ارسال نوتیفیکیشن");
      }
    }
    setLoadingSend(false);
  };

  const handleDeleteNotif = async (id) => {
    setDeleteTargetId(id);
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      toast.success("حذف شد");
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      toast.error("خطا در حذف نوتیفیکیشن");
    }
    setDeleteTargetId(null);
  };

  const handleMarkRead = async (id) => {
    setMarkReadTargetId(id);
    try {
      const notif = notifications.find((n) => n.id === id);
      if (!notif) return;
      await axiosInstance.patch(`/notifications/${id}`, {
        ...notif,
        is_read: true,
      });
      setNotifications((prev) =>
        prev.map((n) => n.id === id ? { ...n, is_read: true } : n)
      );
      toast.success("علامت زده شد به عنوان خوانده شده");
    } catch (e) {
      toast.error("خطا در تغییر وضعیت");
    }
    setMarkReadTargetId(null);
  };

  const sentList = notifications.filter(n => n.user_id === user?.id);
  const inboxList = notifications.filter(n => n.sender_id === user?.id && n.user_id !== user?.id);

  useEffect(() => {
    if (!isAdmin && activeTab === "sent") {
      setActiveTab("inbox");
    }
  }, [isAdmin, activeTab]);

  return (
    <div className="p-4 lg:p-8 min-h-[90vh]" dir="rtl">
      <Toaster className="dana" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="moraba text-2xl font-semibold">اعلان‌ها</h1>
        <div className="flex gap-4 items-center">
          <span className="text-sm text-gray-600 dark:text-gray-200">
            {activeTab === "inbox"
              ? `دریافتی: ${inboxList.length}`
              : `ارسالی: ${sentList.length}`}
          </span>
          {isAdmin && (
            <Button
              onClick={openSendModal}
              className="flex gap-2 items-center bg-gradient-to-l from-indigo-800 to-blue-500 text-white hover:scale-105 active:scale-95 transition"
              type="button"
            >
              <LuSend /> ارسال اعلان
            </Button>
          )}
        </div>
      </div>
      <Tabs tabs={tabsToShow} activeTab={activeTab} onChange={setActiveTab} />

      {loadingList ? (
        <LuLoaderCircle className="animate-spin h-7 w-7 mx-auto mt-8" />
      ) : (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mx-auto">
          {(activeTab === "inbox" ? inboxList : sentList).length === 0 ? (
            <div className="rounded-xl text-center p-12 shadow text-gray-400 flex flex-col items-center justify-center gap-3 col-span-3">
              <CiBellOff className="mx-auto text-5xl" />
              اعلانی برای نمایش وجود ندارد
            </div>
          ) : (
            (activeTab === "inbox" ? inboxList : sentList).map((notif) => (
              <NotificationBox
                key={notif.id}
                notif={notif}
                deleting={deleteTargetId === notif.id}
                markingRead={markReadTargetId === notif.id}
                onDelete={handleDeleteNotif}
                onMarkRead={handleMarkRead}
                currentUser={user}
                type={activeTab}
              />
            ))
          )}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent dir="rtl" className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>ارسال اعلان</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSendNotif} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="user_id">برای کاربر</Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="جستجو کاربر..."
                  className="mb-2"
                  value={formData.user_search || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      user_search: val,
                    }));
                  }}
                  disabled={loadingUsers}
                />
                <Select
                  value={formData.user_id}
                  onValueChange={(value) => handleSelectChange("user_id", value)}
                  disabled={loadingUsers}
                >
                  <SelectTrigger id="user_id">
                    <SelectValue placeholder={loadingUsers ? "در حال بارگذاری..." : "انتخاب کاربر"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(usersData.filter(user => {
                      const search = (formData.user_search || "").toLowerCase();
                      return (
                        user.full_name?.toLowerCase().includes(search) ||
                        user.username?.toLowerCase().includes(search)
                      );
                    })).map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        <span className="font-bold">{user.full_name}</span>
                        <span className="mx-1 text-xs text-gray-500">({user.username})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.user_id && <p className="text-red-500 text-sm">{errors.user_id}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">نوع پیام</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
                name="type"
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="انتخاب نوع اعلان" />
                </SelectTrigger>
                <SelectContent>
                  {NOTIF_TYPES.map(ntype => (
                    <SelectItem key={ntype.value} value={ntype.value}>{ntype.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">متن پیام</Label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="متن پیام را وارد کنید..."
                className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y min-h-[84px] ${errors.message ? "border-red-500" : ""}`}
                autoFocus
              />
              {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="ml-2"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                لغو
              </Button>
              <Button type="submit" disabled={loadingSend}>
                {loadingSend && <LuLoaderCircle className="animate-spin h-4 w-4 ml-2" />}
                ارسال پیام
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notifications;