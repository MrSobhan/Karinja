import React, { useEffect, useState } from "react";
import CardSlider from "./Slider/Slider";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import useAxios from "@/hooks/useAxios";
import { useNavigate } from "react-router-dom";

export function SliderJobPosts() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const axiosInstance = useAxios();

    useEffect(() => {
        setLoading(true);
        axiosInstance
            .get("/job_postings/")
            .then(res => {
                setJobs(res.data || []);
                setError("");
            })
            .catch(err => {
                setError("خطا در دریافت لیست شغل‌ها");
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <CardSlider title="آگهی‌های استخدامی">
            {loading ? (
                <div className="p-8 text-center text-gray-500">در حال بارگذاری ...</div>
            ) : error ? (
                <div className="p-8 text-center text-red-500">{error}</div>
            ) : jobs.length === 0 ? (
                <div className="p-8 text-center text-gray-500">آگهی شغلی فعالی وجود ندارد.</div>
            ) : (
                jobs.map(job => (
                    <Card
                        className="w-[300px] cursor-pointer transition-shadow hover:shadow-lg"
                        key={job.id}
                        onClick={() => navigate(`/job/${job.id}`)}
                    >
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">
                                {job.title}
                            </CardTitle>
                            <CardDescription>
                                {job.company && job.company.full_name
                                    ? `شرکت ${job.company.full_name}`
                                    : null}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-2 text-sm text-gray-600">
                                {job.location && (
                                    <span>📍 {job.location}</span>
                                )}
                            </div>
                            <div className="mb-2 text-xs text-gray-700 line-clamp-3">
                                {job.job_description}
                            </div>
                            <div className="text-xs mt-3 text-neutral-500 flex gap-x-2 flex-wrap">
                                {job.employment_type && (
                                    <span className="bg-gray-100 px-2 py-1 rounded border text-[12px]">{job.employment_type}</span>
                                )}
                                {job.job_categoriy && (
                                    <span className="bg-gray-100 px-2 py-1 rounded border text-[12px]">{job.job_categoriy}</span>
                                )}
                                {job.salary_unit && (
                                    <span className="bg-gray-100 px-2 py-1 rounded border text-[12px]">
                                        حقوق: {job.salary_range || "نامشخص"} {job.salary_unit}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={e => {
                                    e.stopPropagation();
                                    navigate(`/job/${job.id}`);
                                }}
                            >
                                مشاهده بیشتر
                            </Button>
                        </CardFooter>
                    </Card>
                ))
            )}
        </CardSlider>
    );
}
