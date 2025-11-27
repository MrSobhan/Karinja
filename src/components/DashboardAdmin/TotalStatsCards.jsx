import { FaUsers, FaBuilding, FaClipboardList, FaFileAlt, FaSuitcase } from "react-icons/fa"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ICONS = {
  total_users: (
    <span className="inline-flex items-center justify-center rounded-full bg-blue-300/20 w-10 h-10 lg:w-14 lg:h-14">
      <FaUsers className="text-blue-500 lg:w-7 lg:h-7" />
    </span>
  ),
  total_companies: (
    <span className="inline-flex items-center justify-center rounded-full bg-green-300/20 w-10 h-10 lg:w-14 lg:h-14">
      <FaBuilding className="text-green-500 lg:w-7 lg:h-7" />
    </span>
  ),
  total_job_postings: (
    <span className="inline-flex items-center justify-center rounded-full bg-orange-300/20 w-10 h-10 lg:w-14 lg:h-14">
      <FaClipboardList className="text-orange-500 lg:w-7 lg:h-7" />
    </span>
  ),
  total_job_applications: (
    <span className="inline-flex items-center justify-center rounded-full bg-purple-300/20 w-10 h-10 lg:w-14 lg:h-14">
      <FaSuitcase className="text-purple-500 lg:w-7 lg:h-7" />
    </span>
  ),
  total_resumes: (
    <span className="inline-flex items-center justify-center rounded-full bg-pink-300/20 w-10 h-10 lg:w-14 lg:h-14">
      <FaFileAlt className="text-pink-500 lg:w-7 lg:h-7" />
    </span>
  ),
}

const TITLES_FA = {
  total_users: " کاربران",
  total_companies: " شرکت‌ها",
  total_job_postings: "فرصت ها",
  total_resumes: " رزومه‌ها",
  total_job_applications: "درخواست ها",
}

export default function TotalStatsCards({ totals }) {
  if (!totals) return null

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <h2 className="text-2xl font-bold moraba">آمار کلی سامانه</h2>
      <div className="grid grid-cols-2  lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {Object.entries(totals).map(([key, value]) => (
          <Card
            key={key}
            className={`flex items-center text-right lg:gap-x-3  ${
              key === "total_resumes" ? "col-span-2 lg:col-span-1" : ""
            }`}
          >
            <CardHeader className="px-2 py-4">
              <div className="flex justify-centermb-2">{ICONS[key]}</div>
            </CardHeader>
            <CardContent className="flex items-start px-0 py-2 flex-col">
              <CardTitle className="text-sm lg:text-lg lg:mb-1">{TITLES_FA[key] || key}</CardTitle>
              <p className="lg:text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

