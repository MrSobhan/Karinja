import React, { useEffect, useState, useContext } from "react";
import useAxios from "@/hooks/useAxios";
import { Toaster, toast } from "sonner";
import AuthContext from "@/context/authContext";
import { Button } from "@/components/ui/button";
import { LuLoaderCircle } from "react-icons/lu";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);
  const axiosInstance = useAxios();

  useEffect(() => {
    if (user?.user_id) {
      fetchSavedJobs();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/saved_jobs/?user_id=${user.user_id}`);
      setSavedJobs(res.data || []);
    } catch (e) {
      toast.error("خطا در دریافت شغل‌های ذخیره‌شده");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (savedJobId) => {
    try {
      await axiosInstance.delete(`/saved_jobs/${savedJobId}`);
      toast.success("شغل از لیست ذخیره‌شده حذف شد");
      fetchSavedJobs();
    } catch (e) {
      toast.error("حذف شغل با خطا مواجه شد");
    }
  };

  return (
    <div
      className="p-4 lg:p-6 min-h-[60vh]  transition-colors duration-300"
      dir="rtl"
    >
      <Toaster className="dana" richColors />
      <h1 className="text-2xl font-semibold moraba mb-6 text-gray-800 dark:text-gray-100">شغل‌های ذخیره‌شده</h1>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <LuLoaderCircle className="animate-spin h-8 w-8 text-black dark:text-white" />
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="rounded shadow p-6 text-center text-muted-foreground dark:text-zinc-400 flex flex-col items-center gap-3">
          <span className="mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-off-icon lucide-heart-off"><path d="M10.5 4.893a5.5 5.5 0 0 1 1.091.931.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 1.872-1.002 3.356-2.187 4.655" /><path d="m16.967 16.967-3.459 3.346a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 2.747-4.761" /><path d="m2 2 20 20" /></svg>
          </span>
          شغلی ذخیره نکرده‌اید.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobs.map((saved) => {
            // Adapt if needed for API shape: saved.job_posting might be object or id
            const job = saved.job_posting || saved;
            return (
              <div
                key={saved.id}
                className="bg-white dark:bg-zinc-800 rounded-lg shadow p-5 flex flex-col gap-3 border border-gray-100 dark:border-zinc-700 transition-colors duration-300"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-lg text-gray-800 dark:text-gray-100">
                    {job.job_title || "عنوان نامشخص"}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleUnsave(saved.id)}
                  >
                    حذف
                  </Button>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    {job.company_name || job.company || "بدون نام شرکت"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 line-clamp-2">
                    {job.description || job.summary || ""}
                  </p>
                </div>
                <div className="flex justify-end">
                  <a
                    href={`/job/${job.id || saved.job_posting_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline text-sm transition-colors hover:text-blue-900 dark:hover:text-blue-300"
                  >
                    مشاهده جزئیات
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
