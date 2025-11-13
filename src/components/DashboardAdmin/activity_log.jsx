import React, { useEffect, useState } from "react";
import useAxios from "@/hooks/useAxios";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DataTable } from "@/components/data-table";
import { LuLoaderCircle } from "react-icons/lu";

const headers = [
  { key: "type", label: "نوع فعالیت" },
  { key: "description", label: "توضیحات" },
  { key: "activity_date", label: "تاریخ" },
  { key: "user", label: "کاربر" },
];

const mappings = {
  user: (v, row) => row.user ? row.user.full_name : "",
};

function ActivityLog() {
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [loginCount, setLoginCount] = useState(0);

  const axiosInstance = useAxios();

  const fetchActivityLogs = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/activity_logs/?offset=0&limit=100`);
      setActivityLogs(response.data);
      setLoginCount(response.data.filter(x => x.type === "ورود به سیستم" || x.type === "login").length);
    } catch (err) {
      toast.error("خطا در دریافت لاگ فعالیت‌ها");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/activity-log/${deleteTargetId}`);
      toast.success("لاگ با موفقیت حذف شد");
      fetchActivityLogs();
    } catch (error) {
      toast.error("خطا در حذف لاگ");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="p-4 lg:p-6" dir="rtl">
      <Toaster className="dana" />
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold moraba">لاگ فعالیت‌ها</h1>
          <p className="text-md mt-1 text-gray-500">تعداد لاگین‌ها: <span className="font-bold">{loginCount}</span></p>
        </div>
      </div>
      {loading ? (
        <LuLoaderCircle className="animate-spin h-8 w-8 mx-auto mt-10 text-black dark:text-white" />
      ) : (
        <DataTable
          headers={headers}
          data={activityLogs}
          onDelete={handleDeleteClick}
          valueMappings={mappings}
          hideEdit
        />
      )}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>حذف لاگ</DialogTitle>
          </DialogHeader>
          <p className="my-5">آیا مطمئن هستید که می‌خواهید این لاگ را حذف کنید؟</p>
          <DialogFooter>
            <Button
              variant="outline"
              className="ml-2"
              onClick={() => setDeleteDialogOpen(false)}
            >
              انصراف
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ActivityLog;